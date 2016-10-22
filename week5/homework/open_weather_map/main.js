/*
Open Weather Map Instructions:

1)
- Use either $.ajax or $.get to GET the current weather data for New York City
- Use the API docs to figure out how to properly structure the weatherUrl below (http://openweathermap.org/current)
	- Hint: search the docs for "city name"
- Be sure to include in the weatherUrl the option to receive data in your units of choice (imperial, metric, etc.)
	- Hint: search the docs for "units format"
- First, print the response to the console, then, using the API's response, print the following data to #nyc-weather:
	- The current "temp"
	- The current "humidity"
	- The current wind "speed"

2)
- Add a form to to the index.html page that allows the user to enter a city and a state
- Capture this form's submit event and dynamically create the weatherUrl below from the user's input
- Print this result to the DOM

3) Bonus:
- Change the background color based on the temperature; ie colder temps should be blue, and hotter temps red

4) Intermediate Bonus:
- Implement handlebars.js templates :)

5) Legendary Bonus:
- Sign up for the flicker API: https://www.flickr.com/services/api/
- Use the flicker search photo library: https://www.flickr.com/services/api/flickr.photos.search.html
- Hint: you will have to convert the responses from the search API into images: https://www.flickr.com/services/api/misc.urls.html
- Instead of changing the background color based on temperature, change the background to first result the flicker API returns for the city
- Ex: user enters "Brooklyn" - search flicker API for "Brooklyn" and use the first image

*/

//TO DO STILL:
//Identify how to choose the units
//change hard-coded location ID to a selection


$(document).ready(function () {

	var defaultCity = "New York";

	//Get the weather in NYC from the Open Weather Map API
	//var apiKey = 'ff606e9e1755c1137521201c3bcbac5d';
	// var weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?id=5128638&&APPID=ff606e9e1755c1137521201c3bcbac5d&units=metric'
	getWeather(defaultCity);
	buildcitiesUI(); //Build city selection UI and handlers
	showFlickr(defaultCity); //Show the Flickr image: idea is to call this once at the beginning and then again if a new city is chosen
})

function getWeather(city) {   //get weather from API and call the display function to display it


	var urlBase = 'http://api.openweathermap.org/data/2.5/find'
	var arg = []
	arg[0] = '?q=' + city
	arg[1] = '&&APPID=ff606e9e1755c1137521201c3bcbac5d&units=metric'
	weatherUrl = urlBase + arg

	//Use AJAX to get the data from the API endpoint at weatherUrl:
	$.ajax({
		  url: weatherUrl,
		  type: 'GET',
		  success: displayWeather,   //what if we just wanted to return the data and use it in this function?
		  error: function (xhr) { console.log(xhr); }
		})

}

function displayWeather(result){	//Display the weather in NYC on the web page
	
	// console.log("displayWeather -- city is:")
	// console.log(city)

	//Pull the output we want from the result of the API call
	console.log("displayweather result");
	console.log(result);
	var textResult = JSON.stringify(result);
	temp = result.list[0].main.temp;
	humidity = result.list[0].main.humidity;
	speed = result.list[0].wind.speed;
	city = result.list[0].name; //??? WHAT IF THE CITYNAME WASN'T IN THE DATA GIVEN TO US? I can't find a way to pass the city name to these inner functions
	//Build the output text
	var outputArray = []
	outputArray[0] = "Temperature is " + temp + " C";
	outputArray[1] = "Humidity is " + humidity + "%";
	outputArray[2] = "Wind speed is " + speed + " m/s";
	console.log(outputArray);

	//Send output to the DOM
	// for (i in output) { $('#weather-div').append('<p>' + output[i] + '</p>'); }

	//Display output using Handelbar template
	var weatherObj = {
		city: city,
	    outputs: outputArray
	};

	//step 1: grab the handlebars HTML template
    var source = $('#weather-template').html();
	//step 2: compile the template using Handlebars.compile()
    var template = Handlebars.compile(source);
	//step 3: pass compile the obj
    var weatherTemplate = template(weatherObj);
	//step 4: append the obj(s) to the div element, after empyting it
	$('#weather-div').empty();
    $('#weather-div').append(weatherTemplate);

}

//Look up "city" in Flickr
function showFlickr(city) { 
	console.log(city + " is the chosen city");
	var baseUrl = "https://api.flickr.com/services/rest/"
	var params = [ "?method=flickr.photos.search",
				// "?method=flickr.stats.getPopularPhotos",
				"&api_key=b619ab4dc2f3218b93edc2bdf586a175",
				"&text=" + city + "%20skyline",
				"&format=json",
				"&nojsoncallback=1"
				]
	var flickrUrl = [baseUrl, ...params].join("")
	console.log(flickrUrl)
	
	$.ajax({
	  url: flickrUrl,
	  type: 'GET',
	  success: function (result) { displayImage(result) },
	  error: function (xhr) { console.log(xhr); }
	})

}

function displayImage(result) {
	console.log("displayImage function says: ")
	console.log(result);
	console.log("First photo is " + result.photos.photo[0].title);
	console.log(result.photos.photo[0]);
	// console.log(result.photos.perpage + " photos per page")

	photoNum = Math.floor(result.photos.perpage * Math.random()) //pick a random image from first page of results

	var photo = result.photos.photo[photoNum];
	var photoUrl = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "h.jpg";
	var pictureHtml = '<img alt="'+ photo.title + '"src="' + photoUrl + '"/>'

	console.log("pictureHtml = " + pictureHtml);
	
	$('html').css( { "background-image" :    "url(" + photoUrl + ")",
					 "background-size" :     "cover",
					 "background-repeat" :   "no-repeat",
					 // "background-position" : "center" 
				   } );
}

function buildcitiesUI() {
	var citiesObject = {
	    cities: [
	        'New York',
	        'Washington DC',
	        'San Francisco',
	        'Chicago',
	        'Boston',
	        'Miami',
	        'Sydney',
	        'Melbourne',
	        'London',
	        'Paris',
	        'Auckland'
	    ]
	}

	//HB needs to take in an object
	var selectObj = {
	    prompt: "Select another city",
	    cities: citiesObject.cities
	};

	//step 1: grab the handlebars HTML template
    var source = $('#cities-template').html();
	//step 2: compile the template using Handlebars.compile()
    var template = Handlebars.compile(source);
	//step 3: pass compile the obj
    var selectTemplate = template(selectObj);
	//step 4: append the obj(s) to the html element
    $('#city-list').append(selectTemplate);

    //attach an action 'changeCity' to the city-selector menu
    $('#city-selector').on("change", changeCity)

    function changeCity() {
    	console.log("change city!")
    	city = $('#city-selector').val();
    	console.log(city);
    	getWeather(city);
    	showFlickr(city);
    }
}
