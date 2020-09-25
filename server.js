'use strict';

const _ = require('lodash');
require('app-module-path').addPath('./shared');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require("express");
const authRoutes = require('./server/auth_routes');
//const userRoutes = require('./server/profile_routes');
const passportSetup = require('./server/passport_setup');
const passport = require('passport');
const app = express();

app.use(express.static(__dirname + '/build'));
app.use(bodyParser.json());
app.use(cookieParser());

const config = require('nconf')
	.argv()
	.env({ lowerCase: true })
	.file('environment', { file: `config/${process.env.NODE_ENV}.json` })
	.file('defaults', { file: 'config/default.json' });


//DB
require('mongoose')
	.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/naturalcrit')
	.connection.on('error', () => { console.log(">>>ERROR: Run Mongodb.exe ya goof!") });

//// initialize passport
//app.use(passport.initialize());

//Load in account api Routes
app.use(require('./server/account.api.js'));

// set up routes
app.use('/auth', authRoutes);
//app.use('/user', userRoutes);

//Homebrew Redirect
app.all('/homebrew*', (req, res) => {
	return res.redirect(302, 'http://homebrewery.naturalcrit.com' + req.url.replace('/homebrew', ''));
});


const render = require('vitreum/steps/render');
const templateFn = require('./client/template.js');

app.get('/badges', (req, res)=>{
	render('badges', templateFn, { url : req.url })
		.then((page) => res.send(page))
		.catch((err) => console.log(err));
})

//Render Main Page
app.get('*', (req, res) => {
	let authToken = '';
	if(res.locals && res.locals.jwt){
		authToken = res.locals.jwt;
		console.log("AUTH TOKEN");
		console.log(authToken);
	}

	render('main', templateFn, {
			url : req.url,
			user : req.user,
			authToken : authToken,
			domain : config.get('domain')
		})
		.then((page) => res.send(page))
		.catch((err) => console.log(err));
});


var port = process.env.PORT || 8010;
app.listen(port);
console.log('Listening on localhost:' + port);
