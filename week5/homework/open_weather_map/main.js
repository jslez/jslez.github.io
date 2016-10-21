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
	var apiKey = 'ff606e9e1755c1137521201c3bcbac5d';
	var weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?id=5128638&&APPID=ff606e9e1755c1137521201c3bcbac5d&units=metric'
	$.ajax({
		  url: weatherUrl,
		  type: 'GET',
		  success: function (result) { displayWeather(result) },
		  error: function (xhr) { console.log(xhr); }
		})
	buildcitiesUI(); //Build city selection UI and handlers
	showFlickr(defaultCity); //Show the Flickr image: idea is to call this once at the beginning and then again if a new city is chosen

})


function displayWeather(result){	//Display the weather in NYC on the web page
	
	//Pull the output we want from the result of the API call
	console.log(result);
	var textResult = JSON.stringify(result);
	console.log(textResult);
	temp = result.main.temp;
	humidity = result.main.humidity;
	speed = result.wind.speed;

	//Build the output text
	var output = []
	output[0] = "Temperature is " + temp + " C";
	output[1] = "Humidity is " + humidity + " %";
	output[2] = "Wind speed is " + speed + " m/s";
	console.log(output);

	//Send output to the DOM
	for (i in output) { $('#nyc-weather').append('<p>' + output[i] + '</p>'); }

}

function showFlickr(city) {
	console.log(city + " is the chosen city");
	var flickrUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=b619ab4dc2f3218b93edc2bdf586a175&text=new+york&format=json&nojsoncallback=1"
	//Look up "city" in Flickr
	$.ajax({
	  url: flickrUrl,
	  type: 'GET',
	  success: function (result) { displayImage(result) },
	  error: function (xhr) { console.log(xhr); }
	})

	//Show the image somehow
}

function displayImage(result) {
	console.log("displayImage function says: ")
	console.log(result);
	console.log("First photo is " + result.photos.photo[0].title);
	console.log(result.photos.photo[0]);

	var photo = result.photos.photo[0];
	var photoUrl = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg";
	var pictureHtml = '<img alt="'+ photo.title + '"src="' + photoUrl + '"/>' + '</a>'

	console.log(pictureHtml);
	$('#flickr-photo').append(pictureHtml);
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
	var titleObj = {
	    title: "Select another city",
	    description: "",
	    cities: citiesObject.cities
	};

	//step 1: grab the handlebars HTML template
    var source = $('#cities-template').html();
    
	//step 2: compile the template using Handlebars.compile()
    var template = Handlebars.compile(source);

	//step 3: pass compile the obj
    var titleTemplate = template(titleObj);

	//step 4: append the obj(s) to the html element
    $('#city-list').append(titleTemplate);
}
