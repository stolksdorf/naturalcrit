const jwt = require('jwt-simple');
const router = require('express').Router();

const config = require('nconf')
	.argv()
	.env({ lowerCase: true })
	.file('environment', { file: `config/${process.env.NODE_ENV}.json` })
	.file('defaults', { file: 'config/default.json' });

const AccountModel = require('./account.model.js').model;


//Bumpo these out to a api file
router.post('/login', (req, res) => {
	const user = req.body.user;
	const pass = req.body.pass;

	AccountModel.login(user, pass)
		.then((jwt) => {
			return res.json(jwt);
		})
		.catch((err) => {
			return res.status(err.status || 500).json(err);
		});

	//return res.status(200).send();
});

router.post('/signup', (req, res) => {
	const user = req.body.user;
	const pass = req.body.pass;

	AccountModel.signup(user, pass)
		.then((jwt) => {
			return res.json(jwt);
		})
		.catch((err) => {
			return res.status(err.status || 500).json(err);
		});
});

router.post('/link', (req, res) => {
	AccountModel.findOne({username: req.body.username})
	.then((localUser) => {
		// Add googleId to user
		localUser.googleId = req.body.user.googleId;
		localUser.googleRefreshToken = req.body.user.googleRefreshToken;

		localUser.save((err, updatedUser) => {
			if(err) {
				return res.status(err.status || 500).json(err);
			}
			console.log('Local user updated with Google Id: ' + updatedUser);
			updatedUser.googleAccessToken  = req.body.user.googleAccessToken;
			return res.json(updatedUser.getJWT());
		});
	});
});

router.get('/user_exists/:username', (req, res) => {
	if(!req.params.username) {
		return res.json(false);
	}
	AccountModel.getUser(req.params.username)
		.then((user) => {
			return res.json(!!user);
		})
		.catch((err) => {
			return res.status(err.status || 500).json(err);
		});
});





module.exports = router;
