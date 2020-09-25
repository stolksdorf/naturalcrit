const mongoose = require('mongoose');
const _ = require('lodash');
const config = require('nconf');

const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

const SALT_WORK_FACTOR = 10;

const AccountSchema = mongoose.Schema({
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: false },

	googleId: 				 	String,
	googleAccessToken:  String,
	googleRefreshToken: String,


}, { versionKey: false });


AccountSchema.pre('save', function(next) {
	const account = this;
	console.log('start save');
	//if (!account.isModified('password')) return next(); //Need to remove this to allow logins without password via google
	if (account.isModified('password')) {
		console.log("in password");

		const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
		const hash = bcrypt.hashSync(account.password, salt);

		console.log("still in password");

		if(!hash) return next({ok : false, msg : 'err making password hash'});
		account.password = hash;
	}

	console.log("end save");
	//return next();
	return next();
	console.log("after next");
});

AccountSchema.statics.login = function(username, pass){
	const BadLogin = { ok : false, msg : 'Invalid username and password combination.', status : 401};

	let user;
	return Account.getUser(username)
		.then((_user) => {
			if(!_user) throw BadLogin;
			user = _user;
		})
		.then(() => {
			return user.checkPassword(pass)
		})
		.then((isMatch) => {
			if(!isMatch) throw BadLogin;
			return user.getJWT();
		})
};


AccountSchema.statics.signup = function(username, pass){
	return Account.getUser(username, pass)
		.then((user) => {
			if(user) throw {ok : false, msg : 'User with that name already exists', status : 400};
		})
		.then(() => {
			return Account.makeUser(username, pass);
		})
		.then((newUser) => {
			return newUser.getJWT();
		});
};


AccountSchema.statics.makeUser = function(username, password){
	return new Promise((resolve, reject) => {
		const newAccount = new Account({ username, password });
		newAccount.save((err, obj) => {
			if(err){
				console.log(err);
				return reject({ok : false, msg : 'Issue creating new account'});
			}
			return resolve(newAccount);
		});
	});
};

AccountSchema.statics.getUser = function(username){
	return new Promise((resolve, reject) => {
		Account.find({username : username}, (err, users) => {
			if(err) return reject(err);
			if(!users || users.length == 0) return resolve(false);
			return resolve(users[0]);
		})
	});
};

AccountSchema.methods.checkPassword = function(candidatePassword) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
			if (err) return reject(err);
			return resolve(isMatch);
		});
	});
};

AccountSchema.methods.getJWT = function(){
	const payload = this.toJSON();
	payload.issued = (new Date());

	delete payload.password;
	delete payload._id;

	return jwt.encode(payload, config.get('secret'));
};


const Account = mongoose.model('Account', AccountSchema);

module.exports = {
	schema : AccountSchema,
	model : Account,
}
