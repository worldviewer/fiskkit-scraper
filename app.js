var express = require('express'),
	ejs = require('ejs'),
	bodyParser = require('body-parser'),
	file = require('easy-file'),
	cheerio = require('cheerio'),
	xray = require('x-ray'),
	request = require('request');

var app = express();
var x = xray();

var $;
var articleTitle, articleSubTitle, completeArticle, articleParagraphs;

// Use EJS for templating
app.set('view engine', 'ejs');

// Express will look for static resources in the /public folder
app.use(express.static(__dirname + '/public'));

// body-parser places form inputs onto the req.body object
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
	console.log("In app.get('/') route ...");

	res.render('scrape', {page: null});
});

app.post('/', function(req, res) {
	var scrapePage = req.body.scrapepage;
	var pageBody = '';

	console.log("Scrape page " + scrapePage);

	request(scrapePage, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			pageBody = body;

			console.log('PAGE BODY: \n\n' + pageBody + '\n\n');

			// CHEERIO SCRAPER

			// Cheerio gives us a jQuery-like interface to searching the DOM
			// on the server
			$ = cheerio.load(pageBody);

			// Capture title w/o html tags
			articleTitle = $('.article-main-content h1.title').text();

			// Capture sub-title w/o html tags
			articleSubTitle = $('.article-main-content div.dek').text();

			articleParagraphs = [];
			completeArticle = '';

			// Push paragraphs into array, w/o html tags
			$('.article-body-content').children('p')
				.each(function(i, elem) {
					articleParagraphs.push($(this).text());
				});

			// Join article parts
			completeArticle = articleTitle + '\n\n'
				+ articleSubTitle + '\n\n'
				+ articleParagraphs.join('\n\n');

			// Log results to console, file and page
			// console.log(completeArticle);
			file.write('article.txt', completeArticle);
			res.render('scrape', {page: completeArticle});

		}
	});

	// X-RAY SCRAPER

	// X-Ray provides an ability to digest dynamic pages; I'm
	// using it here to see if it can clarify why the Cheerio
	// selectors appear to only grab the first article

	console.log("\n\nX-RAY TEST 1:\n\n");

	x(scrapePage, '.article-body-content', ['p'])(function(err, paragraphs) {
		console.log(paragraphs);

		console.log("\n\nX-RAY TEST 2:\n\n");

		x(scrapePage, ['p'])(function(err, articles) {
			console.log(articles);
		});
	});

});

app.listen(process.env.PORT || 3000, function() {
	console.log("We have a connection");
});