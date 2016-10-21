	window.onload = function () {
		var button = $('#getDataButton').click(function() {
			makeRequest()
		})

		var url = 'https://gbfs.citibikenyc.com/gbfs/en/station_information.json'
		function makeRequest() {
			$.get(url)
				.done(function(res){console.log(res)})
				.fail(function(xhr){console.log("error has occurred: ", xhr)})
		}

$.ajax({
	url: url,
	type: 'GET',
	dataType: 'JSON',
	success: function(res) {console.log(res)},
	error: function(xhr) {console.log(xhr)}
})
};
