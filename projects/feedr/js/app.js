// Pull the data
// Create an object to store the parts of the data you're interested in
console.log("start");
var urlPrefix 	= 'https://accesscontrolalloworiginall.herokuapp.com/';
var mashableUrl = 'http://mashable.com/stories.json';
var mashableObj = new Source("Mashable", mashableUrl);
getData()

function Source(name, url) {
	console.log("Source constructor function")
	this.name = name;
	this.url = url;
}

// constructor function that creates article objects
function Article(title, date, link, content, shares, topic) {
	this.title = title;
	this.date = date;
	this.content = content;
	this.link = link;
	this.share = shares;
	this.topic = topic;
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

function getData(source) {   //get weather from API and call the display function to display it
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
	console.log ("result = ") + result
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
}





// API key for newsapi -- don't use // e139f9bce2894cd288bad0f4b1993d44  from https://newsapi.org/account
