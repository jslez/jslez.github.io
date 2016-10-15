/* Independent Practice

Making a favorites list: DOM manipulation


- When the user clicks the submit button, take the value they've typed
  into the input box and add it to the list (hint: appendChild)

- Also, when a new item is added to the list, clear the input box.

*/

function addToList(list, newThing) {
	var newThingLi = document.createElement('li');
	var newThingText = document.createTextNode(newThing);
	newThingLi.appendChild(newThingText);
	list.appendChild(newThingLi);

//	console.log(newthingLi);
//grab input field data

//create a new LI

//create a new text node

//put the text node at the end of the LI

//grab the UL
//append the LI to the UL


}

window.onload = function() {
    //identify the button to add an event to
    var button = document.getElementById("new-thing-button");
 //   console.log(button);

    // identify the list element we're adding things to
    var list = document.getElementById("fav-list"); 

    // add the event listener to the button
	button.onclick = function(event) {
		console.log("button has been clicked")
		event.preventDefault();

		// get the input
		var input = document.getElementById('new-thing').value
		console.log(input);

		addToList(list, input);
	}

};

/*

Bonus:

When they click submit without typing anything, alert the user
"you must type in a value!"
  (Hint: the `value` property of the input box, before anyone types in it,
  is the empty string.)

*/


