// D3 stuff for drawing the circles (copied)

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


// #############################################################################
// ######## Main part of the app
// #############################################################################

//Set up the variables needed to get the articles and draw the circles
var shareCutOff = 200; //was 500
var allArticles = [];
var sources = ["abc-news-au", "cnn", "associated-press", "bbc-news", "bloomberg", "cnn", "the-new-york-times", "the-wall-street-journal", "the-verge", "time", "usa-today", "the-washington-post",
			   "the-economist", "the-huffington-post", "reuters", "mashable", "google-news", "buzzfeed"] 
var circlesObj = {
	name: "all articles",
	children: []
	}   //has either name and children (an array), or name and size

// Space out the API calls to avoid exceeding the rate limit
var requests = [];
var requestsSettings = [];   //can we make a 2-column array somehow instead??
setInterval(function() {
    if(requests.length > 0) {
        var request = requests.shift();   //not pop -- we want first in, first out
        var settings = requestsSettings.shift();
        if(typeof request === "function") {
            request(settings);
        }
    // console.log("REQUESTS QUEUE: ")
    // console.log(settings)
    // console.log(requestsSettings)
    // debugger
    }
}, 300);  //200 milliseconds

// Loop through each source


var lastSourceFlag = false
for (i=0; i<sources.length; i++) {
	// $scope.status = "Processing source " + i + sources[i]   <---- HOW TO MAKE THIS WORK??
	if (i == sources.length-1) {lastSourceFlag = true}
	getArticles(sources[i], lastSourceFlag)
		console.log("From main routine: lastSourceFlag = " + lastSourceFlag)
}

function getArticles(source, lastSourceFlag) {
	// console.log("Get getArticles function: " + source)
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
					processArticle(xhrArticles.articles[i], source, endFlag);
					console.log("From getArticles, i = " + i + " out of " + (xhrArticles.articles.length-1) + " and endFlag = " + endFlag)
					endFlag = false // is this necessary??
				}
		    }, 
		  error: function (xhrArticles) { 
		    	console.log("error in ajax call from getArticles");
		    	console.log(xhrArticles); }
		})
}

function processArticle(article, source, endFlag) { 
	// console.log("****ENDFLAG in processArticle function QXX: " + endFlag)
	getShares(article, source, endFlag, function(article, source, xhrShares, endFlag) { //onComplete of getShares
		// console.log("From top of onComplete passed to getShares from processArticle, endFlag = " + endFlag) //undefined
		getTopic2(article, source, xhrShares, endFlag, function(article, source, xhrShares, topic, endFlag) { //onComplete of getTopic
			// console.log(article)
			var articleObj = {
				title: article.title,
				url: article.url,
				text: article.description,
				source: source, // DOES THIS WORK??????
				shares: xhrShares.Facebook.share_count, // check that this works
				// topic: xhrTopic.response.topics[0].label // element 1 or 0 is good
				topic: topic
		   		}
		   	// debugger
		   	// console.log("articleObj from callback to getTopic in processArticle: ")
		   	// console.log(articleObj)
		    allArticles.push(articleObj)  // add the new fully described object to the allArticles array
		    makeCircle(articleObj)

		    if (endFlag) {
		    	console.log("AT THE END, DRAWING THE CIRCLES NOW")
				requests.push(drawCircles)
				requestsSettings.push(circlesObj)
			}
			// if (endFlag) { // execute this when we've just processed the last article of the last source
			// 	console.log("ENDFLAG TRUE JUST BEFORE DRAWCIRCLES!!!! ******")
			// 	drawCircles(circlesObj)
			// 	var endFlag = false //do we need this for some reason??
			// }
		}) //end callback function passed to getTopic
	}) //end callback function passed to getShares
} //end processArticle function


function getShares(article, source, endFlag, onComplete) {
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
       	  mySource: source,
       	  lastArticleFlag: endFlag,
		  success: function (xhr) {
			  	onComplete(this.myArticleObj, this.mySource, xhr, this.lastArticleFlag)
			  }, 
		  error: function (xhr) { console.log("error" + xhr); }
		})
}


function getTopic2(article, source, xhrShares, endFlag, onComplete) {
	var apiKey = '5f4b0287a2a758a3ae2bf44ffbb037f5' //Meaningcloud API key for @jslez
    var apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.meaningcloud.com/topics-2.0'
    // var apiUrl = 'https://api.meaningcloud.com/topics-2.0'
    var postData = article.description
    settings = {
		  "async": true,
		  "crossDomain": true,
		  "url": "https://api.meaningcloud.com/topics-2.0",
		  "method": "POST",
		  "headers": { "content-type": "application/x-www-form-urlencoded" },
		  "data": {
			    "key": apiKey,
			    "lang": "en",
			    "txt": postData,
			    "tt": "ec" //e=entiries, c=concepts (alternative: a = all)
		   },
		  myArticleObj: article,
		  mySharesObj: xhrShares,
		  mySource: source,
	      lastArticleFlag: endFlag
	}
	if (xhrShares.Facebook.share_count > shareCutOff || endFlag == true)  {
		requests.push(function(settings) {
			$.ajax(settings)
				.done(function (xhr) {
					// console.log(xhr);
					if (xhr.status.code == 0) {
					   if (xhr.entity_list.length > 0) { var topic = xhr.entity_list[0].form }
					   else if (xhr.concept_list.length > 0) { var topic = xhr.concept_list[0].form }
					   //  if (xhr.hasOwnProperty(entity_list) && xhr.entity_list.length > 0) { var topic = xhr.entity_list[0].form }
					  	// else if (xhr.hasOwnProperty(concept_list) && xhr.concept_list.length > 0) { var topic = xhr.concept_list[0].form }
					  	else {topic = ""}
				  	}
				  	else {
				  		console.log("error getting topic, here is the xhr function: ")
				  		console.log(xhr)
				  		topic = ""}
				  	// console.log("Topic: " + topic + " Source: " + this.mySource)
				    onComplete(this.myArticleObj, this.mySource, this.mySharesObj, topic, this.lastArticleFlag); //from processArticle
				})
				.fail(function (xhr) {
					console.log("TOPIC FAIL :( ......")
					console.log(xhr);
					// debugger
					onComplete(this.myArticleObj, this.mySource, this.mySharesObj, "[unknown topic]", this.lastArticleFlag); //from processArticle
				})
			})
		requestsSettings.push(settings) //need to store the settings object separately otherwise its current data are lost
		}
	}


function makeCircle(articleObj) {
	// make the new circle object we need to push
	var topic = articleObj.topic
	if (topic == "") {topic = articleObj.title }
	var circleSize = Math.max(1, articleObj.shares)
	// var circleName = ""
	// if (circleSize > 0) {circleName = articleObj.title} // only label the circle if it's big enough
	circleName = articleObj.title
	var newCircle = {
		name: circleName,
		size: circleSize
		}
	//if "topic" is a property of circlesObj then push the article info to the end of that
	//otherwise, create the "topic" property and then push the article in
	var foundTopic = false
	for (i=0; i<circlesObj.children.length; i++) {
		if (circlesObj.children[i].name == topic) {
			circlesObj.children[i].children.push(newCircle)
			foundTopic = true;
		}
	}
	if (circlesObj.children.length > 0 && foundTopic == false) { //we have a new topic so add it in, along with the new article as its one child
			console.log("NEW CIRCLE TOPIC OBJECT")
			var newObj = {
				name: topic,
				children: [newCircle]
			}
			circlesObj.children.push(newObj);
	}
	if (circlesObj.children.length == 0) {
			console.log("FIRST CIRCLE TOPIC OBJECT")
			var newObj = {
				name: topic,
				children: [newCircle]
			}
			circlesObj.children.push(newObj);
	}
	console.log("HERE IS THE CIRCLES-OBJ:")
	console.log(circlesObj)
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


// FIX THE TIMING STUFF: http://stackoverflow.com/questions/109086/stop-setinterval-call-in-javascript
// TO FIX: USING .DONE IS APPARENTLY A NEWER/BETTER THAN "success" - http://stackoverflow.com/questions/14754619/jquery-ajax-success-callback-function-definition/14754681#14754681
