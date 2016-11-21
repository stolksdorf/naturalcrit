const config = require('nconf');
const jwt = require('jwt-simple');
const router = require('express').Router();

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


router.use((req, res, next) => {
	if(req.cookies && req.cookies.nc_session){
		req.user = jwt.decode(req.cookies.nc_session, config.get('secret'));
	}
	return next();
});


module.exports = router;