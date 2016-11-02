const mongoose = require('mongoose');
const _ = require('lodash');

const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

const SALT_WORK_FACTOR = 10;
const SECRET = 'secret';

const AccountSchema = mongoose.Schema({
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true }

}, { versionKey: false });


AccountSchema.pre('save', function(next) {
	const account = this;
	if (!account.isModified('password')) return next();

	const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
	const hash = bcrypt.hashSync(account.password, salt);

	if(!hash) return next({ok : false, msg : 'err making password hash'});
	account.password = hash;
	return next();
});

AccountSchema.statics.login = function(username, pass){
	return new Promise((resolve, reject) => {
		Account.find({username : username}, (err, users) => {
			if(err) return reject(err);
			if(!users || users.length == 0) return reject({ ok : false, msg : 'no User'});

			const user = users[0];
			user.checkPassword(pass)
				.then((isMatch) => {
					if(!isMatch) return reject({ok : false, msg : 'Bad pass'});
					return resolve(user.getJWT());
				})
				.catch(reject)
		});
	});
}

AccountSchema.statics.signup = function(username, pass){
	return new Promise((resolve, reject) => {
		//try to find existing user, fail if found
		//create new entry
		//getJWT for new entry
		//return it
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

	return jwt.encode(payload, SECRET);
};


const Account = mongoose.model('Account', AccountSchema);

module.exports = {
	schema : AccountSchema,
	model : Account,
}