// STUFF FOR D3 

var svg = d3.select("svg"),
    margin = 20,
    diameter = +svg.attr("width"),
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);





// STUFF FROM TOPICFEEDR02

var allArticles = [];
var sources = ["cnn", "abc-news-au", "associated-press", "bbc-news", "bild", "bloomberg"]
var circlesObj = {
	name: "all articles",
	children: []
}
sources.forEach(function(source) {
	getArticlesFromNewsApi(source, function() {  //on complete of getArticlesFromNewsApi
		console.log("IN THE COMPLETE ROUTINE")
		for (i=0; i<allArticles.length; i++) {
			console.log(i)
			var size = Math.max(1, allArticles[i].shares)
			var name = ""
			if (size > 100) { name = allArticles[i].title; }
			var articleCircle = {
				name: name,
				size: size
			}
		circlesObj.children.push(articleCircle);
		}
		console.log("allArticles: ")
		console.log(allArticles)
		drawCircles(circlesObj)
		// console.log("allArticles.length = " + allArticles.length)
	})
} )
console.log("allArticles.length = " + allArticles.length)



function getArticlesFromNewsApi(source, onComplete) {
	console.log("Get getArticlesFromNewsApi function: " + source)
	var apiUrl = 'https://newsapi.org/v1/articles'
	var articles = []
	$.ajax({
		    url: apiUrl,
		    type: 'GET',
		    data: "source=" + source + "&sortBy=top&apiKey=e139f9bce2894cd288bad0f4b1993d44",
		    success: function(xhrArticles) {
		    	processNewArticles(xhrArticles, function(responses) {   //onComplete
		    		//add the new articles as objects to the allArticles array, including shares
		    		for (i = 0; i < responses.length; i++) {
		    			var article = {
		    				title: xhrArticles.articles[i].title,
							url: xhrArticles.articles[i].url,
							text: xhrArticles.articles[i].description,
							source: source,
							shares: responses[i]
		    			}
		    		// console.log(article)
		    		allArticles.push(article)
		    		}
		    		console.log(allArticles.length.toString() + ", " + responses.length.toString() + ", " + sources.length.toString() )
		    		console.log(source + ", " + sources[sources.length-1])
					if (source == sources[sources.length-1]) { onComplete(); } //at the end of all loops
		    	}) 
		    }, 
		  error: function (xhrArticles) { 
		    	console.log("error in ajax call from getArticlesFromNewsApi");
		    	console.log(xhrArticles); }
		})
}

function processNewArticles (xhrArticles, onComplete) {
	console.log("processNewArticles function: ");
	var responses = [];
	for (i = 0; i < xhrArticles.articles.length; i++)  {
		// console.log(i.toString() + ": " + xhrArticles.articles[i].url)
		getShares(xhrArticles.articles[i].url, function(xhrShares) {
			// console.log("anonymous function passed to getShares function in processNewArticles")
			responses.push(xhrShares.Facebook.share_count); //onComplete
			// console.log(responses)
			if (responses.length === xhrArticles.articles.length) {
				console.log("responses.length === xhrArticles.articles.length")
				onComplete(responses);
			}
		})
	}
	
	console.log("end of processNewArticles function");
}

function getShares(articleUrl, onComplete) {
	// console.log("getShares function: " + articleUrl)
	var apiUrl = "//free.sharedcount.com/"
	var apiKey = "f43152ec013dac61809336959ba657739546d5dc"

	$.ajax({
		  type: 'GET',
	      data: {
		        url : articleUrl,
		        apikey : apiKey
	     		 },
          url: apiUrl,
      	  cache: true,
       	  dataType: "json",
		  success: function (xhr) {
			  	console.log("FB shares = " + xhr.Facebook.share_count + ", FB comments = " + xhr.Facebook.comment_count)
			  	onComplete(xhr)
			  }, 
		  error: function (xhr) {
		  	console.log("error getting Shares")
		  	console.log(xhr); }
		})
	

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






// D3 SCRIPT TO DRAW THE CIRCLES


function drawCircles(root) {
 
	console.log("drawCircles function: ")
   	console.log(root)

	  root = d3.hierarchy(root)
	      .sum(function(d) { return d.size; })
	      .sort(function(a, b) { return b.value - a.value; });

	  var focus = root,
	      nodes = pack(root).descendants(),
	      view;

	  var circle = g.selectAll("circle")
	    .data(nodes)
	    .enter().append("circle")
	      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
	      .style("fill", function(d) { return d.children ? color(d.depth) : null; })
	      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

	  var text = g.selectAll("text")
	    .data(nodes)
	    .enter().append("text")
	      .attr("class", "label")
	      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
	      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
	      .text(function(d) { return d.data.name; });

	  var node = g.selectAll("circle,text");

	  svg
	      .style("background", color(-1))
	      .on("click", function() { zoom(root); });

	  zoomTo([root.x, root.y, root.r * 2 + margin]);

	  function zoom(d) {
	    var focus0 = focus; focus = d;

	    var transition = d3.transition()
	        .duration(d3.event.altKey ? 7500 : 750)
	        .tween("zoom", function(d) {
	          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
	          return function(t) { zoomTo(i(t)); };
	        });

	    transition.selectAll("text")
	      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
	        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
	        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
	        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
	  }

	  function zoomTo(v) {
	    var k = diameter / v[2]; view = v;
	    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
	    circle.attr("r", function(d) { return d.r * k; });
	  }
	};

