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

var defaultCity = "New York";
var correctedCity = "";

$(document).ready(function () {
	getWeather(defaultCity);
	buildcitiesUI(); //Build city selection UI and handlers
	// showFlickr(defaultCity); //Show the Flickr image: idea is to call this once at the beginning and then again if a new city is chosen
	var button = $('#new-city-button').click(addNewCity)
	var newThingInput = document.getElementById('new-city');
})

function getWeather(city) {   //get weather from API and call the display function to display it
	console.log("Get weather function: " + city)
	var urlBase = 'http://api.openweathermap.org/data/2.5/find'
	var arg = []
	arg[0] = '?q=' + city
	arg[1] = '&&APPID=ff606e9e1755c1137521201c3bcbac5d&units=metric'
	weatherUrl = urlBase + arg.join("")

	//Use AJAX to get the data from the API endpoint at weatherUrl:
	$.ajax({
		  url: weatherUrl,
		  type: 'GET',
		  success: displayWeather,   //what if we just wanted to return the data and use it in this function?
		  error: function (xhr) { console.log(xhr); }
		})
}

function displayWeather(result) {	//Display the weather in NYC on the web page
	//Clear what's already in the weather results div
	$('#weather-div').empty();

	//Pull the output we want from the result of the API call
	console.log("displayWeather result:");
	console.log(result);
	var textResult = JSON.stringify(result);

	if (result.list.length > 0) {
		var temp = result.list[0].main.temp;
		var humidity = result.list[0].main.humidity;
		var speed = result.list[0].wind.speed;
		var city = result.list[0].name; //??? WHAT IF THE CITYNAME WASN'T IN THE DATA GIVEN TO US? I can't find a way to pass the city name to these inner functions
		console.log("displayWeather says city = " + city)
		correctedCity = city;
		console.log("displayWeather now says correctedCity = " + correctedCity)

		//Build the output text
		var outputArray = []
		outputArray[0] = "Temperature is " + temp + " ºC";
		outputArray[1] = "Humidity is " + humidity + "%";
		outputArray[2] = "Wind speed is " + speed + " m/s";
		
		//Show the weather icon
		var iconCode = result.list[0].weather[0].icon
		var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

		//Display output using Handelbar template
		var weatherObj = {
			city: city,
			imgURL: iconUrl,
		    outputs: outputArray
		};

		//step 1: grab the handlebars HTML template
	    var source = $('#weather-template').html();
		//step 2: compile the template using Handlebars.compile()
	    var template = Handlebars.compile(source);
		//step 3: pass compile the obj
	    var weatherTemplate = template(weatherObj);
		//step 4: append the obj(s) to the div element
	    $('#weather-div').append(weatherTemplate);

	    //Show the new Flickr image
	    showFlickr(correctedCity);
    }
 	else {
 		console.log("display-weather ELSE")
 		$('#city-selector')[0].selectedIndex = 0;
 	}
 	if (city == "") { 
 		$('#city-selector')[0].selectedIndex = 0;
 		changeCity()
 	}
}

//Look up "city" in Flickr
function showFlickr(city) { 
	console.log("showFlickr says: " + city + " is the chosen city");
	var baseUrl = "https://api.flickr.com/services/rest/"
	var params = [ "?method=flickr.photos.search",
				// "?method=flickr.stats.getPopularPhotos",
				"&api_key=07fe1a2b0b9c616e4254daff1cbd5b2d",
				"&text=" + city + "%20sky",
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
	//TO DO: make sure image is decent dimensions and make sure it's available in the size
	console.log("displayImage function says: ")
	console.log(result);
	
	photoNum = Math.floor(result.photos.photo.length * Math.random()) //pick a random image from first page of results
	
	if (photoNum > 1) {
		console.log("photoNum = " + photoNum + " of " + result.photos.photo.length)
		console.log("First photo is " + result.photos.photo[0].title);
		console.log(result.photos.photo[0]);
		// console.log(result.photos.perpage + " photos per page")

			var photo = result.photos.photo[photoNum];
			var photoUrl = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "h.jpg";
			var pictureHtml = '<img alt="'+ photo.title + '"src="' + photoUrl + '"/>'

			console.log("pictureHtml = " + pictureHtml);
			
			$('html').css( { "background-image"  :   "url(" + photoUrl + ")",
							 "background-size"   :   "cover",
							 "background-repeat" :   "no-repeat"
			})
	}
	else {
	console.log("else!!")
		$('html').css( { 	 "background-image" :    "",
							 "background-color" :    "black"
						})
	}
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
}

 function changeCity() {
    	console.log("changecity function!")
    	var city = $('#city-selector').val();
    	console.log(city);
    	getWeather(city);
    }

function addNewCity (event) {
	event.preventDefault();
	console.log("add new city function!")

	var newCityField = document.getElementById('new-city');
	var newCity = titleCase(newCityField.value);
	newCityField.value = "";

	//Add the new city to the menu IF IT'S NOT ALREADY THERE
	var menu = document.getElementById('city-selector');
	var newOption = document.createElement('option');
	newOption.text = newCity;
	menu.add(newOption);
	menu.selectedIndex = (menu.length - 1);
	changeCity()
}

// This function is copied from somewhere online
function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}