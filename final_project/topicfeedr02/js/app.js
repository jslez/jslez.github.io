
console.log("start");
var urlPrefix 	= 'https://accesscontrolalloworiginall.herokuapp.com/';
var mashableUrl = 'http://mashable.com/stories.json';
var mashableObj = new Source("Mashable", mashableUrl);
getData()
getArticlesFromNewsApi("cnn") // test


// Test of getting the sources from News API
// function getNewsApiSources() {
// 	console.log("getNewsApiSources function:")
// 	var apiUrl = 'https://newsapi.org/v1/sources?language=en'
// 	$.ajax({
// 		url: apiUrl,
// 		type: 'GET',
// 		success: useNewsApiSources,
// 		error: function (xhr) { console.log(xhr); }
// 	})
// }

//display the News API sources
// function useNewsApiSources(result) {
// 	console.log("useNewsApiSources:")
// 	console.log(result)
// }

function getData(source) {   //get articles from API and call the display function to display it
	console.log("Get data function: " + source)
	var apiUrl = 'https://accesscontrolalloworiginall.herokuapp.com/http://mashable.com/stories.json'
	$.ajax({
		  url: apiUrl,
		  type: 'GET',
		  success: useData, 
		  error: function (xhr) { console.log(xhr); }
		})
}

function getArticlesFromNewsApi(source) {
	console.log("Get getArticlesFromNewsApi function: " + source)
	var apiUrl = 'https://newsapi.org/v1/articles'
	$.ajax({
		  url: apiUrl,
		  type: 'GET',
		  success: processNewArticles, 
		  data: "source=" + source + "&sortBy=top&apiKey=e139f9bce2894cd288bad0f4b1993d44",
		  error: function (xhr) { console.log(xhr); }
		})
}

function processNewArticles (newArticles) {
	console.log("processNewArticles function: ")
	console.log(newArticles); 
	}

function extractArticleData() {

}



function useData(result) {
	console.log("useData function:")
	console.log ("result = ")
	console.log(result)
	// ### put the result into an object

	// FUNCTION that creates an object that has the data we're interested in
	var articles = extractMashableArticles(result);
	// var firstArticle = new Article(title, date, link, content, shares, topic)
	var testTitle = articles[0].title;
	console.log("firstArticle = ");
	console.log(articles[0]);
	console.log("title of first article = " + articles[0].title);
	$('#testTitle').empty();
	$('#testTitle').append(testTitle);

	analyzeArticleTextRazor("test article string");
}




// Function that parses the object from Mashable and identfies the 6 properties we want
function extractMashableArticles(data) {
	console.log("extractMashableArticles function: ")
	var articles = []
	console.log(data.new[0].title)

	articles.push({
		title: data.new[0].title,
		date: data.new[0].post_date,
		link: data.new[0].link,
		content: data.new[0].content,
		shares: data.new[0].shares.total,
		topic: data.new[0].channel_label
		})

	console.log(articles)
	return articles
}


// Function that calls the Aylien API to analyze an article
function analyzeArticle(article) {  
	console.log("Analyze article function: ")
	console.log(article)
	var UrlToAnalyze = 'http://techcrunch.com/2015/04/06/john-oliver-just-changed-the-surveillance-reform-debate'
	// var apiUrl = 'https://api.aylien.com/api/v1/concepts'
    var apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.aylien.com/api/v1/classify'
    // var UrlToAnalyze = 'http://www.nytimes.com/2016/11/26/opinion/an-unimaginable-day-arrives-in-miami.html'

	$.ajax({
		  url: apiUrl,
		  type: 'POST',
		  host: 'api.aylien.com',
		  headers: { 'Accept': 'application/json',
		  	    	 'X-AYLIEN-TextAPI-Application-Key': 'f6796f47115c6204a9388af25a78bdbb',
		  	         'X-AYLIEN-TextAPI-Application-ID':  'f117e2e6' },
		  data: "url=" + UrlToAnalyze,
		  processData: false,
		  crossDomain: true,
		  success: useAnalysis,
		  error: function (xhr) { console.log(xhr); }
		})
}

function analyzeArticleTextRazor(article) {
	console.log("Analyze article with TextRazor function:")
	// console.log(article)
	var UrlToAnalyze = 'http://techcrunch.com/2015/04/06/john-oliver-just-changed-the-surveillance-reform-debate'
    var apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.textrazor.com/'
    // var postData = "url=" + UrlToAnalyze + "?extractors=entities,entailments"
    var postData = "url=" + UrlToAnalyze
    console.log("postData = " + postData)

	$.ajax({
		  url: apiUrl,
		  type: 'POST',
		  headers: {'x-textrazor-key': '2bc8c5fadcc47d02aaa1a140c7e46c8eb132e240d21317df60731746'},
		  data: postData + "&extractors=" + "entities,entailments",
		  processData: false,
		  crossDomain: true,
		  success: useAnalysis,
		  error: function (xhr) { console.log(xhr); }
		})
// "Unable to open URL: http://techcrunch.com/2015/04/06/john-oliver-just-changed-the-surveillance-reform-debate Error: asio.ssl:336150774 - unknown alert type
}


function useAnalysis(result) {
	console.log("start useAnalysis function")
	console.log(result)
}


// CONSTRUCTOR FUNCTIONS

function Source(name, url) {
	console.log("Source constructor function")
	this.name = name;
	this.url = url;
}

// Constructor function that creates article objects
function Article(title, date, link, content, shares, topic) {
	this.title = title;
	this.date = date;
	this.content = content;
	this.link = link;
	this.share = shares;
	this.topic = topic;
}






// API key for newsapi -- don't use // e139f9bce2894cd288bad0f4b1993d44  from https://newsapi.org/account
