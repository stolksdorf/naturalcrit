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

console.log(config.get('googleClientId'));
passport.initialize();

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

passport.use(new JwtStrategy({
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
		secretOrKey: config.get('authentication_token_secret'),
		issuer: config.get('authentication_token_issuer'),
		audience: config.get('authentication_token_audience')
	},
	async (payload, done) => {
		try {
			const user = await users.getUserById(parseInt(payload.sub));
			if (user) {
				return done(null, user, payload);
			}
			return done();
		} catch (err) {
			return done(err);
		}
	}
));

passport.use(
	new GoogleStrategy({ 		//options for the google strat
		callbackURL: '/auth/google/redirect',
		clientID: config.get('googleClientId'),
		clientSecret: config.get('googleClientSecret'),
		passReqToCallback: true,
		proxy: true //Forces callbackUrl to use https if visited from https
	},
	async (req, accessToken, refreshToken, profile, done) => {
		try {
			const googleUser = await Account.findOne({ googleId: profile.id });
			if (googleUser) { // Google Account already exists, just log in
				googleUser.googleRefreshToken = refreshToken;
				await googleUser.save();
				googleUser.googleAccessToken = accessToken;
				console.log('user logged in via google: ' + googleUser);
				return done(null, googleUser);
			} else { // Google Account does not exist
				if (req.user) { // If Local account exists, merge from Google Account
					console.log("User is already logged in locally");
					const localUser = await Account.findOne({ username: req.user.username });
					// Add googleId to user
					localUser.googleId = profile.id;
					localUser.googleRefreshToken = refreshToken;
					const updatedUser = await localUser.save();
					console.log('Local user updated with Google Id: ' + updatedUser);
					updatedUser.googleAccessToken = accessToken;
					console.log(updatedUser);
					return done(null, updatedUser);
				} else { // If Local account does not exist either, wait until user is created in googleRedirect before merging accounts
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
		} catch (err) {
			console.error(err);
			return done(err);
		}
	})
);
