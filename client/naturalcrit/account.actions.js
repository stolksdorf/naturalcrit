const request = require('superagent');

const AccountActions = {

	login : (user, pass) => {
		return new Promise((resolve, reject) => {
			console.log('ACCOUNT ACTIONS LOGIN:');
			request.post('/login')
				.send({ user , pass })
				.end((err, res) => {
					if(err) return reject(res.body);
					console.log("createsession");
					console.log(res.body);
					AccountActions.createSession(res.body);
					return resolve(res.body);
				});
		});
	},

	loginGoogle : (jwt) => {
		console.log('ACCOUNT ACTIONS GOOGLE LOGIN:');
		AccountActions.createSession(jwt);
		console.log("created cookie with Google JWT");

			// const strWindowFeatures = 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
			// let signInWindow;
			// signInWindow = window.open('auth/google', "Sign in to Homebrewery with Google", strWindowFeatures);
			// signInWindow.focus();
			//
			// window.addEventListener('message', event => receiveMessage(event), false);
			// request.get('auth/google')
			// 	.end((err, res) => {
			// 		if(err) return reject(res.body);
			// 		console.log('createsession google');
			// 		console.log(res.body);
			// 		AccountActions.createSession(res.body);
			// 		return resolve(res.body);
			// 	})
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
		// MAKE COOKIE WORK WITH LOCALHOST FOR TESTING
		document.cookie = `nc_session=${token};max-age=${60*60*24*365}; path=/; SameSite='None', Secure`;
		//document.cookie = `nc_session=${token};max-age=${60*60*24*365}; path=/;domain=${window.domain};`;
	},

	removeSession : () => {
		document.cookie = `nc_session=;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
		//document.cookie = `nc_session=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;domain=${window.domain};`;
	}
}

module.exports = AccountActions;
