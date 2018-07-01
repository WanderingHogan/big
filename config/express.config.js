const express = require('express'),
	corser = require('corser'),
	bodyParser = require('body-parser'),
	path = require('path');

module.exports = function (app, config) {
	
	app.use(bodyParser())
	
	//setting up static directory to serve up front end site
	console.warn(path.join(__dirname, '../assets'))
	app.use('/', express.static(path.join(__dirname, '../assets')));
	
	//enable cross domain access everywhere!
	app.use(corser.create());
	
}