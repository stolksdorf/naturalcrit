const request = require('superagent');

const AccountActions = {
	login: (user, pass) => {
		return new Promise((resolve, reject) => {
			request
				.post('/login')
				.send({ user, pass })
				.end((err, res) => {
					if (err) return reject(res.body);
					AccountActions.createSession(res.body);
					return resolve(res.body);
				});
		});
	},

	signup: (user, pass) => {
		return new Promise((resolve, reject) => {
			request
				.post('/signup')
				.send({ user, pass })
				.end((err, res) => {
					if (err) return reject(res.body);
					AccountActions.createSession(res.body);
					return resolve(res.body);
				});
		});
	},

	linkGoogle: (username, pass, user) => {
		return new Promise((resolve, reject) => {
			request
				.post('/link')
				.send({ username, pass, user })
				.end((err, res) => {
					if (err) return reject(res.body);
					AccountActions.createSession(res.body);
					return resolve(res.body);
				});
		});
	},

	validateUsername: (username) => {
		const regex = /^(?!.*@).{3,}$/;
		return regex.test(username);
	},

	checkUsername: (username) => {
		return new Promise((resolve, reject) => {
			request
				.get(`/user_exists/${username}`)
				.send()
				.end((err, res) => {
					if (err) return reject(res.body);
					return resolve(res.body);
				});
		});
	},

	rename: (username, newUsername, password) => {
		console.log('attempting rename');
		return AccountActions.login(username, password)
			.then(() => {
				return new Promise((resolve, reject) => {
					request
						.put('/rename')
						.send({ username, newUsername })
						.end((err, res) => {
							if (err) return reject(err);
							console.log('correctly renamed, now relogging');
							AccountActions.removeSession();
							AccountActions.login(newUsername, password).then(() => {
								setTimeout(() => {
									window.location.reload();
								}, 500);
							});
							request
								.put('https://homebrewery.naturalcrit.com/api/user/rename')
								.withCredentials() //send session cookie manually
								.send({ username, newUsername })
								.end((err, res) => {
									if (err) return reject(err);
									return resolve(res.body);
								});
						});
				});
			})
			.catch((err) => {
				return Promise.reject(err);
			});
	},

	createSession: (token) => {
		const domain = window.domain === '.local.naturalcrit.com' ? 'localhost' : window.domain;
		document.cookie = `nc_session=${token}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax;domain=${domain}`;
	},

	removeSession: () => {
		const domain = window.domain === '.local.naturalcrit.com' ? 'localhost' : window.domain;
		document.cookie = `nc_session=; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax; domain=${domain}`;
	},
};

module.exports = AccountActions;
