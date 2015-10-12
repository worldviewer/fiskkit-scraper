# fiskkit-scraper

An article extractor which when given a url string as input will scrape the complete text of the article and return it as a text file. 

## Example Input

Your method can take as input the following url string:

http://www.thedailybeast.com/articles/2014/08/21/swat-lobby-takes-a-shot-at-congress.html

News articles are structured differently so your extractor may not work for all of them, but should at least work for the one provided in the example.

## Output

The main body of the article written to a text file 

## Constraints

Use either Angular or JavaScript

## Learned Something New

Along the way, I noticed something unexpected about the way that jQuery selectors interact with this particular article's DOM ...

The Daily Beast delivers the article requested, of course, but then appends several other more recent articles.  Visually, and in Google Chrome's Dev Tools, all of the articles appear pretty normal.  But, what had me a bit perplexed is that those add-on articles are apparently not accessible to my DOM queries.

I noticed this first with the Node web scraper module, Cheerio (which conveniently filters the DOM with jQuery-like selectors on the server).  I get this behavior even though consoling my Node request object very clearly indicates that the entire HTML, with all of the articles included, is captured by the HTTP request.

So, I then replicated the weirdness in X-Ray, which is a more sophisticated version of Cheerio.  Same thing.

I then created a couple of very simple test cases with just pure jQuery to validate that I wasn't crazy.  When I place the Daily Beast site's content onto my own HTML page, include jQuery, and then use jQuery to select for all p tags, it still only returns those p tags associated with that first article.

Looking a bit closer at the content that is returned from Node's Request module, I now see that although I can observe p tags for those other articles in Chrome's Dev Tools, my HTTP request does not return that content with p tags.  A p tag instead comes as escaped characters, like ...

&lt;p&gt;

The browser doesn't blink at this, but jQuery and other similar tools seem to just completely miss it.