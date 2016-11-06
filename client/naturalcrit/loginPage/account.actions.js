const request = require('superagent');

const AccountActions = {

	login : (user, pass) => {
		return new Promise((resolve, reject) => {
			request.post('/login')
				.send({ user , pass })
				.end((err, res) => {
					if(err) return reject(res.body);
					AccountActions.createSession(res.body);
					return resolve(res.body);
				});
		});
	},

	signup : (user, pass) => {
		return new Promise((resolve, reject) => {
			request.post('/signup')
				.send({ user , pass })
				.end((err, res) => {
					if(err) return reject(res.body);
					AccountActions.createSession(res.body);
					return resolve(res.body);
				});
		});
	},

	checkUsername : (username) => {
		return new Promise((resolve, reject) => {
			request.get(`/user_exists/${username}`)
				.send()
				.end((err, res) => {
					if(err) return reject(res.body);
					return resolve(res.body);
				});
		});
	},

	createSession : (token) => {
		document.cookie = `nc_session=${token};expires=Thu, 18 Dec 2018 12:00:00 UTC; path=/;`;
	},

	removeSession : () => {
		document.cookie = `nc_session=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
	}
}

module.exports = AccountActions;