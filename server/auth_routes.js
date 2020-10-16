const router = require('express').Router();
const passport = require('passport');
const token = require('./token.js');

//TODO: MERGE from ACCOUNT.API.JS then probably rename ACCOUNT.API.JS

function generateUserToken(req, res) {
  const accessToken = token.generateAccessToken(req, res);
	console.log("Successfully Generated JWT after Google Login");
	console.log(accessToken);
  return accessToken;
	//res.render('authenticated.html', {
  //  token: accessToken
  //});
}
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
});
// auth login
router.get('/login', (req, res) => {
	res.render('login');
});

// auth logout
router.get('/logout', (req, res) => {
	// handle with passport
	res.send('logging out');
});

// auth with google - goes to google authentication popup
router.get('/google',
	passport.authenticate('google', {
    // display: 'page',
		session: false,
		scope: ['profile', 'https://www.googleapis.com/auth/drive.file'],
    accessType: 'offline', // uncomment these if refreshToken is not sent
    prompt: 'consent'
}));

// callback route for google after the authentication popup
router.get('/google/redirect',
  //Check if there is an existing local user
  passport.authenticate('google', { session: false }, ),
  (req, res, next) => {
    if(!req.user.username) {  //stay on the page if we still need local sign in
      return next();
    }
    const jwt = generateUserToken(req, res);
    console.log("about to redirect");
    const JWTToken = jwt;
    res.cookie('nc_session', JWTToken, {maxAge: 1000*60*60*24*365, path: '/', sameSite: 'lax', domain: '.naturalcrit.com'});
    res.redirect('/success');
  });

module.exports = router;
