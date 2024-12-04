const mongoose = require('mongoose');
const _ = require('lodash');
const config = require('nconf');

const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const AccountSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: false },

	googleId: String,
	googleAccessToken: String,
	googleRefreshToken: String,

}, { versionKey: false });

AccountSchema.pre('save', async function (next) {
	try {
		const account = this;
		console.log(account);
		if (account.isModified('password')) {
			const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
			account.password = await bcrypt.hash(account.password, salt);
		}
		next();
	} catch (err) {
		next({ ok: false, msg: 'Error generating password hash' });
	}
});

AccountSchema.statics.login = async function(username, pass) {
	const BadLogin = { ok: false, msg: 'Invalid username and password combination.', status: 401 };
	let user = await this.getUser(username);
	if (!user) throw BadLogin;

	const isMatch = await user.checkPassword(pass);
	if (!isMatch) throw BadLogin;

	return user.getJWT();
};

AccountSchema.statics.signup = async function(username, pass) {
	let user = await this.getUser(username);
	if (user) throw { ok: false, msg: 'User with that name already exists', status: 400 };

	const newUser = await this.makeUser(username, pass);
	return newUser.getJWT();
};

AccountSchema.statics.makeUser = async function(username, password) {
	const newAccount = new this({ username, password });
	try {
		await newAccount.save();
		return newAccount;
	} catch (err) {
		throw { ok: false, msg: 'Issue creating new account', error: err };
	}
};

AccountSchema.statics.getUser = async function(username) {
	const users = await this.find({ username });
	if (!users || users.length === 0) return false;
	return users[0];
};

AccountSchema.methods.checkPassword = async function(candidatePassword) {
	return bcrypt.compareSync(candidatePassword, this.password);
};

AccountSchema.methods.getJWT = function() {
	const payload = this.toJSON();
	payload.issued = new Date();

	delete payload.password;
	delete payload._id;

	return jwt.encode(payload, config.get('secret'));
};

const Account = mongoose.model('Account', AccountSchema);

module.exports = {
	schema: AccountSchema,
	model: Account,
};
