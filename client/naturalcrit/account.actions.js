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

	linkGoogle : (username, pass, user) => {
		return new Promise((resolve, reject) => {
			request.post('/link')
				.send({ username , pass, user })
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
		// MAKE COOKIE WORK WITH LOCALHOST FOR TESTING
		//document.cookie = `nc_session=${token};max-age=${60*60*24*365}; path=/; samesite=lax`;
		document.cookie = `nc_session=${token}; max-age=${60*60*24*365}; path=/; samesite=lax; domain=${window.domain}`;
	},

	removeSession : () => {
		document.cookie = `nc_session=; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax; domain=${window.domain}`;
		//document.cookie = `nc_session=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;domain=${window.domain};`;
	}
}

module.exports = AccountActions;
