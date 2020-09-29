const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Account = require('./account.model.js').model;

// Load configuration values
const config = require('nconf')
	.argv()
	.env({ lowerCase: true })	// Load environment variables
	.file('environment', { file: `config/${process.env.NODE_ENV}.json` })
	.file('defaults', { file: 'config/default.json' });

passport.initialize();

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});


passport.use(new JwtStrategy({
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
		secretOrKey: config.get('authentication_token_secret'),
		issuer: config.get('authentication_token_issuer'),
		audience: config.get('authentication_token_audience')
	},
	(payload, done) => {
	  const user = users.getUserById(parseInt(payload.sub));
	  if (user) {
	      return done(null, user, payload);
	  }
	  return done();
	}
));

passport.use(
	new GoogleStrategy({ 		//options for the google strat
		callbackURL: '/auth/google/redirect',
		clientID: config.get('googleClientId'),
		clientSecret: config.get('googleClientSecret'),
		passReqToCallback: true
	},
	(req, accessToken, refreshToken, profile, done) => {
		Account.findOne({googleId: profile.id}).then((googleUser) => {
			if(googleUser) { // Google Account already exists, just log in
				googleUser.googleRefreshToken = refreshToken;

				googleUser.save().then((googleUser) => {
					googleUser.googleAccessToken  = accessToken;
					console.log('user logged in via google: ' + googleUser);
					return done(null, googleUser);
				});
			}
			else {					// Google Account does not exist
				if(req.user){	// If Local account exists, merge from Google Account
					console.log("User is already logged in locally");
					Account.findOne({username: req.user.username}).then((localUser) => {
						// Add googleId to user
						localUser.googleId = profile.id;
						localUser.googleRefreshToken = refreshToken;

						localUser.save((err, updatedUser) => {
							if(err) {console.log(err); return done("err");}
							console.log('Local user updated with Google Id: ' + updatedUser);
							updatedUser.googleAccessToken  = accessToken;
							console.log(updatedUser);
							return done(null, updatedUser);
						});
					});
				}
				else{				// If Local account does not exist either, wait until user is created in googleRedirect before mergin accounts
					console.log("not logged in locally");
					const newAccount = new Account({
						googleId: profile.id,
						googleRefreshToken: refreshToken,
						googleAccessToken: accessToken
					});
					req.user = newAccount;
					return done(null, newAccount);
				}
			}
		});
	})
);
