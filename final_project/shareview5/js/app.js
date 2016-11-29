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
// Loop through each source
var lastSourceFlag = false
for (i=0; i<sources.length; i++) {
	if (i == sources.length-1) {lastSourceFlag = true}
	getArticles(sources[i], lastSourceFlag)
	console.log("From main routine: lastSourceFlag = " + lastSourceFlag)
}

function getArticles(source, lastSourceFlag) {
	console.log("Get getArticles function: " + source)
	var apiUrl = 'https://newsapi.org/v1/articles'
	var articles = []
	$.ajax({
		    url: apiUrl,
		    type: 'GET',
		    data: "source=" + source + "&sortBy=top&apiKey=e139f9bce2894cd288bad0f4b1993d44",
		    success: function(xhrArticles) {
				// Process one article at a time, fully, up to loading it as an object into the allArticles
				for (i=0; i < xhrArticles.articles.length; i++) {
					var endFlag = false
					if ((i == (xhrArticles.articles.length-1)) && lastSourceFlag) { endFlag = true}
					processArticle(xhrArticles.articles[i], endFlag);
					console.log("From getArticles, i = " + i + " out of " + xhrArticles.articles.length-1 + " and endFlag = " + endFlag)
				}
		    }, 
		  error: function (xhrArticles) { 
		    	console.log("error in ajax call from getArticles");
		    	console.log(xhrArticles); }
		})
}

function processArticle(article, endFlag) { 
	getShares(article, endFlag, function(article, xhrShares, endFlag) { //onComplete of getShares
		// console.log("From top of onComplete passed to getShares from processArticle, endFlag = " + endFlag) //undefined
		getTopic(article, xhrShares, endFlag, function(article, xhrShares, xhrTopic, endFlag) { //onComplete of getTopic
			var articleObj = {
				title: article.title,
				url: article.url,
				text: article.description,
				source: "source", // FIX THIS
				shares: xhrShares.Facebook.share_count, // check that this works
				topic: xhrTopic.response.topics[1].label // element 1 or 0 is good
		   		}
		   	console.log("articleObj from callback to getTopic in processArticle: ")
		   	console.log(articleObj)
		    allArticles.push(articleObj)  // add the new fully described object to the allArticles array
			var circleSize = Math.max(1, xhrShares.Facebook.share_count)
			var circleName = ""
			if (circleSize > 100) { circleName = article.title; } // only label the circle if it's big enough
			var newCircle = {
				name: circleName,
				size: circleSize
				}
			circlesObj.children.push(newCircle);
			// console.log ("From end of callback function passed to gettopic in processarticle, endFlag = " + endFlag)
			// console.log ("END OF CALLBACK FUNCTION PASSED TO GETTOPIC")
			if (endFlag) { drawCircles(circlesObj) }
		}) //end callback function passed to getTopic
	}) //end callback function passed to getShares
} //end processArticle function

function getShares(article, endFlag, onComplete) {
	console.log("getShares function: " + article.url);
	var apiUrl = "//free.sharedcount.com/"
	var apiKey = "f43152ec013dac61809336959ba657739546d5dc"
	$.ajax({
		  type: 'GET',
	      data: {
		        url : article.url,
		        apikey : apiKey
	     		 },
          url: apiUrl,
      	  cache: true,
       	  dataType: "json",
       	  myArticleObj: article,
       	  lastArticleFlag: endFlag,
		  success: function (xhr) {
			  	console.log("******FB shares = " + xhr.Facebook.share_count + ", FB comments = " + xhr.Facebook.comment_count)
			  	console.log("THIS.LASTARTICLEFLAG = " + this.lastArticleFlag)
			  	onComplete(this.myArticleObj, xhr, this.lastArticleFlag)
			  }, 
		  error: function (xhr) { console.log("error" + xhr); }
		})
}

function getTopic(article, xhrShares, endFlag, onComplete) {
	console.log("Analyze article with TextRazor function: ")
    var apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.textrazor.com/'
    var postData = "text=" + article.description
	$.ajax({
		  url: apiUrl,
		  type: 'POST',
		  headers: {'x-textrazor-key': '2bc8c5fadcc47d02aaa1a140c7e46c8eb132e240d21317df60731746'},
		  data: postData + "&extractors=" + "topics",
		  processData: false,
		  crossDomain: true,
		  myArticleObj: article,
		  mySharesObj: xhrShares,
		  lastArticleFlag: endFlag,
		  success: function (xhr) {
		  	 // console.log("analyzeArticleTextRazor success! xhr = ")
		  	 // console.log(xhr);
		  	 // console.log("topic = " + xhr.response.topics[1].label)
		  	 // console.log("this.myArticleObj is = ");
		  	 // console.log(this.myArticleObj)
		  	 // console.log("this.mySharesObj is = ");
		  	 // console.log(this.mySharesObj.Facebook.share_count)
		  	 onComplete(this.myArticleObj, this.mySharesObj, xhr, this.lastArticleFlag); //from processArticle
		  },
		  error: function (xhr) {
		  	console.log("getTopic error" + xhr);
		  }
		})
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

