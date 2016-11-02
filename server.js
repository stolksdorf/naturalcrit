'use strict';

const _ = require('lodash');
require('app-module-path').addPath('./shared');
const vitreumRender = require('vitreum/render');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require("express");
const app = express();
app.use(express.static(__dirname + '/build'));
app.use(bodyParser.json());
app.use(cookieParser());

//Mongoose
const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/naturalcrit';
mongoose.connect(mongoUri);
mongoose.connection.on('error', function(){
	console.log(">>>ERROR: Run Mongodb.exe ya goof!");
});

const AccountModel = require('./server/account.model.js').model;



//Homebrew Reidrect
app.all('/homebrew*', (req, res) => {
	return res.redirect(302, 'http://homebrewery.naturalcrit.com' + req.url.replace('/homebrew', ''));
});


//Bumpo these out to a api file
app.post('/login', (req, res) => {
	const user = req.body.user;
	const pass = req.body.pass;

	AccountModel.login(user, pass)
		.then((jwt) => {
			return res.json(jwt);
		})
		.catch((err) => {
			return res.json(err);
		});

	//return res.status(200).send();
});

app.post('/signup', (req, res) => {
	const user = req.body.user;
	const pass = req.body.pass;

	console.log(user, pass);

	//move to account model
	var newAccount = new AccountModel({
		username : user,
		password : pass
	});
	newAccount.save(function(err, obj){
		if(err){
			console.error(err, err.toString(), err.stack);
			return res.status(500).send(`Error while creating new account, ${err.toString()}`);
		}
		return res.json(obj);
	});

});


const jwt = require('jwt-simple');
app.get('/test', (req, res) => {
	console.log('cookies', req.cookies);
	if(req.cookies.session){
		const cool = jwt.decode(req.cookies.session, 'secret');

		return res.json(cool)
	}

});

const accountMW = (req, res, next) => {
	if(req.cookies && req.cookies.session){
		req.user = jwt.decode(req.cookies.session, 'secret');
	}
	return next();
}




//Render Page
app.get('*', accountMW, (req, res) => {
	vitreumRender({
		page: './build/naturalcrit/bundle.dot',
		globals:{},
		prerenderWith : './client/naturalcrit/naturalcrit.jsx',
		initialProps: {
			user : req.user,
			url: req.originalUrl,
		},
		clearRequireCache : !process.env.PRODUCTION,
	}, (err, page) => {
		return res.send(page)
	});
});


var port = process.env.PORT || 8010;
app.listen(port);
console.log('Listening on localhost:' + port);