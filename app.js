var express = require('express'),
	ejs = require('ejs'),
	request = require('request');

var app = express();

// Use EJS for templating
app.set('view engine', 'ejs');

// Express will look for static resources in the /public folder
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	console.log("In app.get('/') route ...");

	res.render('scrape');
});

app.listen(process.env.PORT || 3000, function() {
	console.log("We have a connection");
});