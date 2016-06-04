'use strict';

var _ = require('lodash');
require('app-module-path').addPath('./shared');
var vitreumRender = require('vitreum/render');
var express = require("express");
var app = express();
app.use(express.static(__dirname + '/build'));



app.all('/homebrew*', (req, res) => {
	return res.redirect(302, 'http://homebrewery.naturalcrit.com' + req.url.replace('/homebrew', ''));
})


app.get('*', function (req, res) {
	vitreumRender({
		page: './build/main/bundle.dot',
		globals:{},
		prerenderWith : './client/main/main.jsx',
		initialProps: {
			url: req.originalUrl
		},
		clearRequireCache : !process.env.PRODUCTION,
	}, function (err, page) {
		return res.send(page)
	});
});


var port = process.env.PORT || 8000;
app.listen(port);
console.log('Listening on localhost:' + port);