$(document).ready(function() {

var myMap;

// function getCoords() { }

function initMap() {
	myMap = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 40.7127, lng: -74.0059},
		zoom: 14
	})
} //initMap

initMap();

$.ajax({
	url: 'http://api.citybik.es/citi-bike-nyc.json',
	type: 'GET',
	success: function(data) {
		buildBikeMarkers(data)
	},
	error: function(xhr) { console.log(error)}
})

function buildBikeMarkers(stations){
	var infoWindow = new google.maps.InfoWindow()
	stations.forEach(function(station) {
		var lat = station.lat / 1000000
		var lng = station.lng / 1000000
		var marker = new google.maps.Marker( {
			position: {lat:lat, lng:lng},
			map: myMap,
			title:station.name
		})
		var content = '<div>' + station.name + '</div>'
		marker.addListener('click', function() {
			infoWindow.close()
			infoWindow.setContent(content)
			infoWindow.open(map, marker)
		})

	})
}



}) //document


