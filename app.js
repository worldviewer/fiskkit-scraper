var express = require('express'),
	ejs = require('ejs'),
	bodyParser = require('body-parser'),
	request = require('request');

var app = express();

// Use EJS for templating
app.set('view engine', 'ejs');

// Express will look for static resources in the /public folder
app.use(express.static(__dirname + '/public'));

// body-parser places form inputs onto the req.body object
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
	console.log("In app.get('/') route ...");

	res.render('scrape');
});

app.post('/url', function(req, res) {
	var scrapePage = req.body.scrapepage;
	var pageBody = '';

	console.log("Scrape page " + scrapePage);

	request(scrapePage, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			pageBody = body;

			console.log(pageBody);
		}
	})

	res.render('scrape');
});

app.listen(process.env.PORT || 3000, function() {
	console.log("We have a connection");
});