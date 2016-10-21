	window.onload = function () {
		//document.getElementByID('output').onclick = makeRequest
		$(document).ready(function  ()  {})
		function makeRequest() {
			var url = 'https://gbfs.citibikenyc.com/gbfs/en/station_information.json';
			//create an instance of XMLHttpRequest
			var httpRequest = new XMLHttpRequest();
			//set a custom function to handle the request
			httpRequest.onreadystatechange = responseMethod
			//open GET request to the url
			httpRequest.open('GET', url)

			function responsemethod() {
				//check if our state is "DONE"
				if (httpRequest.readystate === XMLHttpRequest.DONE)
					if (httpRequest.status === 200) {
						console.log(JSON.parse(httpRequest.response))
						var data = JSON.parse(httpRequest.response)
					}
				else { console.log("we have a problem Houson")}
			}
		}
	};