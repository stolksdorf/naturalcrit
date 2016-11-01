const mongoose = require('mongoose');
const _ = require('lodash');

const bcrypt = require('bcrypt-nodejs');
const SALT_WORK_FACTOR = 10;

const AccountSchema = mongoose.Schema({
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true }

}, { versionKey: false });


AccountSchema.pre('save', function(next) {
	const account = this;

	// only hash the password if it has been modified (or is new)
	if (!account.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);
		// hash the password along with our new salt
		bcrypt.hash(account.password, salt, function(err, hash) {
			if (err) return next(err);
			account.password = hash;
			next();
		});
	});
});

AccountSchema.methods.checkPassword = (candidatePassword) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
			if (err) return reject(err);
			return resolve(isMatch);
		});
	});
};

AccountSchema.methods.getJWT = () => {
	return new Promise((resolve, reject) => {


	});
};


const Account = mongoose.model('Account', AccountSchema);

module.exports = {
	schema : AccountSchema,
	model : Account,
}