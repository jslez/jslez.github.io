

var articles = [
  "url",
  "url",
  "url"
]

getAll(articles, function(responses) {
    // do stuff with responses 
});

function getAll(articles, oncomplete) {

  var responses = [];
  for (var i = 0; i < articles.length; i++) {
    getShares(articles[i], function(xhr) {
      responses.push(xhr);
      if (responses.length === articles.lenght) {
        oncomplete(responses);
      }
    });
  }

}


function getShares(articleUrl, oncomplete) {
	console.log("******getShares function: ")
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
			  	console.log("success getting Shares:")
			  	console.log(xhr); 
			  	console.log("FB shares = " + xhr.Facebook.share_count)
			  	console.log("FB comments = " + xhr.Facebook.comment_count)
			  	console.log("do we know variable i? ---> " + i)
          oncomplete(xhr);
			  	// waitForApi = false
			  }, 
		  error: function (xhr) {
		  	console.log("error getting Shares")
		  	console.log(xhr); }
		})
	
  
 @jslez
  
         
Write  Preview

Leave a comment
Attach files by dragging & dropping,  Choose Files selecting them, or pasting from the clipboard.
 Styling with Markdown is supported
Comment
Contact GitHub API Training Shop Blog About
© 2016 GitHub, Inc. Terms Privacy Security Status Help