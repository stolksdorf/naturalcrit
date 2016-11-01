'use strict';

var _ = require('lodash');
require('app-module-path').addPath('./shared');
var vitreumRender = require('vitreum/render');
var bodyParser = require('body-parser')
var express = require("express");
var app = express();
app.use(express.static(__dirname + '/build'));
app.use(bodyParser.json());

//Mongoose
var mongoose = require('mongoose');
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/naturalcrit';
mongoose.connect(mongoUri);
mongoose.connection.on('error', function(){
	console.log(">>>ERROR: Run Mongodb.exe ya goof!");
});

const AccountModel = require('./server/account.model.js').model;


//Homebrew Reidrect
app.all('/homebrew*', (req, res) => {
	return res.redirect(302, 'http://homebrewery.naturalcrit.com' + req.url.replace('/homebrew', ''));
});



app.post('/login', (req, res) => {
	const user = req.body.user;
	const pass = req.body.pass;





	return res.status(200).send();
});






//Render Page
app.get('*', (req, res) => {
	vitreumRender({
		page: './build/naturalcrit/bundle.dot',
		globals:{},
		prerenderWith : './client/naturalcrit/naturalcrit.jsx',
		initialProps: {
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