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

const config = require('nconf')
	.argv()
	.env({ lowerCase: true })
	.file('environment', { file: `config/${process.env.NODE_ENV}.json` })
	.file('defaults', { file: 'config/default.json' });


//DB
require('mongoose')
	.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/naturalcrit')
	.connection.on('error', () => { console.log(">>>ERROR: Run Mongodb.exe ya goof!") });


//Load in account api Routes
app.use(require('./server/account.api.js'));



//Homebrew Reidrect
app.all('/homebrew*', (req, res) => {
	return res.redirect(302, 'http://homebrewery.naturalcrit.com' + req.url.replace('/homebrew', ''));
});



//Render Page
app.get('*', (req, res) => {
	vitreumRender({
		page: './build/naturalcrit/bundle.dot',
		globals:{
		},
		prerenderWith : './client/naturalcrit/naturalcrit.jsx',
		initialProps: {
			user : req.user,
			url  : req.originalUrl,
		},
		clearRequireCache : !process.env.PRODUCTION,
	}, (err, page) => {
		return res.send(page)
	});
});


var port = process.env.PORT || 8010;
app.listen(port);
console.log('Listening on localhost:' + port);