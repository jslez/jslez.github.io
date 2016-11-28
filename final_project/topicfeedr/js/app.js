// Pull the data
// Create an object to store the parts of the data you're interested in
console.log("start");
var urlPrefix 	= 'https://accesscontrolalloworiginall.herokuapp.com/';
var mashableUrl = 'http://mashable.com/stories.json';
var mashableObj = new Source("Mashable", mashableUrl);
getData()


function getData(source) {   //get articles from API and call the display function to display it
	console.log("Get data function: " + source)
	var urlBase = 'https://accesscontrolalloworiginall.herokuapp.com/http://mashable.com/stories.json'
	var arg = []
	dataUrl = urlBase

	$.ajax({
		  url: dataUrl,
		  type: 'GET',
		  success: useData,   //what if we just wanted to return the data and use it in this function?
		  error: function (xhr) { console.log(xhr); }
		})
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

	analyzeArticle("test article string");
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



// Function that calls the NLP API to analyze an article
function analyzeArticle(article) {  
	console.log("Analyze article function: ")
	console.log(article)
	testUrl = 'http://www.nytimes.com/2016/11/25/opinion/betsy-devos-and-the-wrong-way-to-fix-schools.html?action=click&pgtype=Homepage&clickSource=story-heading&module=opinion-c-col-right-region&region=opinion-c-col-right-region&WT.nav=opinion-c-col-right-region&_r=0'
	// var apiUrl = 'https://api.aylien.com/api/v1/concepts'
    var apiUrl = 'https://accesscontrolalloworiginall.herokuapp.com/https://api.aylien.com/api/v1/concepts'

	$.ajax({
		  url: apiUrl,
		  type: 'GET',
		  host: 'api.aylien.com',
		  // headers: { 'Accept': 'application/json',
     				 // 'Content-Type': 'application/x-www-form-urlencoded',
     				 // 'Content-Length': postData.length,
		  //	  	 'X-AYLIEN-TextAPI-Application-Key': 'f6796f47115c6204a9388af25a78bdbb',
		  //	     'X-AYLIEN-TextAPI-Application-ID':  'f117e2e6' },
		  // data:{"url": testUrl},

		  beforeSend: function(xhr) { 
     			 xhr.setRequestHeader({'X-AYLIEN-TextAPI-Application-Key': 'f6796f47115c6204a9388af25a78bdbb',
				 'X-AYLIEN-TextAPI-Application-ID':  'f117e2e6'}); 
    },
		  data: {"text": "Apple was founded by Steve Jobs, Steve Wozniak and Ronald Wayne."},
		  crossDomain : true,
		  success: useAnalysis,
		  error: function (xhr) { console.log(xhr); }
		})
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
