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
var sources = ["cnn", "abc-news-au", "associated-press"] //, "bbc-news", "bild", "bloomberg"]
var circlesObj = {
	name: "all articles",
	children: []
}
// Loop through each source
sources.forEach(function(source) {
	getArticles(source, function() {  //Get all the articles from the source
		//On complete, loop through each article and put them all inside the articleCircle object
		for (i=0; i<allArticles.length; i++) {
			console.log(i) // I DON'T THINK WE GET HERE EVEN
			var size = Math.max(1, allArticles[i].shares)
			var name = ""
			if (size > 100) { name = allArticles[i].title; }
			var articleCircle = {
				name: name,
				size: size
			}
			circlesObj.children.push(articleCircle);
		}
	console.log("allArticles: ")   //WE NEVER'T SEE THIS
	console.log(allArticles)
	drawCircles(circlesObj)  // NEEDS AN IF STATEMENT TO KNOW THAT GETARTICLES HAS FINISHED
	// console.log("allArticles.length = " + allArticles.length)
	})

} )
console.log("allArticles.length = " + allArticles.length)   // WE DO SEE THIS, EQUALS 0 bc other functions run asynchronously



function getArticles(source, onComplete) { //onComplete here should push new articles into circlesObj
	console.log("Get getArticles function: " + source)
	var apiUrl = 'https://newsapi.org/v1/articles'
	var articles = []
	$.ajax({
		    url: apiUrl,
		    type: 'GET',
		    data: "source=" + source + "&sortBy=top&apiKey=e139f9bce2894cd288bad0f4b1993d44",
		    success: function(xhrArticles) {
		    	processNewArticles(xhrArticles, function(shares, topics) {   //onComplete in processNewArticles
		    		console.log("Do we have access to xhrArticles here? If so, let's use it for the loop length: ")
		    		console.log(xhrArticles)
		    		debugger
		    		//add the new articles as objects to the allArticles array, including shares
		    		for (i = 0; i < shares.length; i++) {   // let's not use shares.length
		    			var article = {
		    				title: xhrArticles.articles[i].title,
							url: xhrArticles.articles[i].url,
							text: xhrArticles.articles[i].description,
							source: source,
							shares: shares[i],
							topic: topics[i]
		    			}
		    		allArticles.push(article)
		    		}
		    		console.log(allArticles.length.toString() + ", " + shares.length.toString() + ", " + sources.length.toString() )
		    		console.log(source + ", " + sources[sources.length-1])
					if (source == sources[sources.length-1]) {  //at the end of loop through sources
						console.log("****ON COMPLETE INSIDE GETARTICLES IS ABOUT TO BE CALLED") //NO
						onComplete();
						console.log("*****ON COMPLETE INSIDE GETARTICLES WAS JUST CALLED") //NO
					} 
		    	}) 
		    }, 
		  error: function (xhrArticles) { 
		    	console.log("error in ajax call from getArticles");
		    	console.log(xhrArticles); }
		})
}

function processNewArticles (xhrArticles, onComplete) {
	console.log("processNewArticles function: ");
	var shares = [];
	var topics = [];
	for (i = 0; i < xhrArticles.articles.length; i++)  {
		getShares(xhrArticles.articles[i].url, function(xhrShares) {  // onComplete
			shares.push(xhrShares.Facebook.share_count);
			if (shares.length === xhrArticles.articles.length && topics.length === xhrArticles.articles.length) {
				onComplete(shares, topics);
			}
		})
		getTopic(xhrArticles.articles[i].description, function(xhrTopic) {  // onComplete
			console.log("in the callback function that's defined in processNewArticles -> call to getTopic")
			topics.push(xhrTopic.response.topics[1].label);
			if (shares.length === xhrArticles.articles.length && topics.length === xhrArticles.articles.length ) { 
				onComplete(shares, topics);
			}
		})
	}
	console.log(shares)
	console.log(topics)
	console.log("end of processNewArticles function");
}

function getShares(articleUrl, onComplete) {
	console.log("getShares function: " + articleUrl)
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

// function getTopic(text, onComplete) {
// 	console.log("in the getTopic function")
// 	console.log("text = " + text)
// 	var topic = analyzeArticleTextRazor(text);
// 	onComplete(topic)
// 	return topic
// }


// was: analyzeArticleTextRazor
function getTopic(text, onComplete) {
	console.log("Analyze article with TextRazor function: ")
    var apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.textrazor.com/'
    // var postData = "url=" + UrlToAnalyze + "?extractors=entities,entailments"
    var postData = "text=" + text
    // console.log("postData = " + postData)

	$.ajax({
		  url: apiUrl,
		  type: 'POST',
		  headers: {'x-textrazor-key': '2bc8c5fadcc47d02aaa1a140c7e46c8eb132e240d21317df60731746'},
		  data: postData + "&extractors=" + "topics",
		  processData: false,
		  crossDomain: true,
		  success: function (xhr) {
		  	 console.log("analyzeArticleTextRazor success! xhr = ")
		  	 console.log(xhr);
		  	 onComplete(xhr);
		  },
		  error: function (xhr) { console.log(xhr); }
		})
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

