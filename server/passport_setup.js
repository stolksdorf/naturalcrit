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
		secretOrKey: config.get('authentication.token.secret'),
		issuer: config.get('authentication.token.issuer'),
		audience: config.get('authentication.token.audience')
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
		// after authenticating:
		// check if user already exists in our db
		console.log("is google strategy starting?");
		console.log("FRESH ACCESS TOKEN: " + accessToken);
		console.log("FRESH REFRES TOKEN: " + refreshToken);

		Account.findOne({googleId: profile.id}).then((currentUser) => {
			console.log("looking for user");
			console.log(req.user);
			if(currentUser){
				// already have the user
				console.log("already have google account");
				if(currentUser.username != req.user.username) {
					console.log("This google account is already linked to another user!");
					return done("This google account is already linked to another user!");
				}

				if(!req.user){
					console.log("not logged in locally, but account exists");
					return done("This google account is already linked to another user!");
				}

				if(currentUser.username == req.user.username) {
					console.log("Already Logged In!");
				}

				currentUser.googleRefreshToken = refreshToken;

				currentUser.save().then((currentuser) => {
					currentuser.googleAccessToken  = accessToken;
					console.log('user logged in via google: ' + currentuser);
					return done(null, currentuser);
				});
			} else {
				console.log("no google account");

				if(!req.user){
					console.log("not logged in locally to link account!");
					new Account({
						googleId: profile.id,
					});
					return done("err");
				}

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
		});
	})
);
