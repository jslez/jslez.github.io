window.onload = function () {   
	// if you put the script tag before the body, you need to do this

var p = document.createElement("p")
var text = document.createTextNode("Hello world")
p.appendChild(text)
//document.body.appendChild(p)

var  ul = document.getElementById("gaCampuses")
// document.body.insertBefore(p, ul)

ul.insertBefore(p, ul.childNodes[0])

var button = document.getElementById('clickme')
button.onclick = function(event) {

	
}

}
