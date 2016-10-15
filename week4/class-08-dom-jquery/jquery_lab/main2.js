/* Independent Practice

Making a favorites list: jQuery

You'll add the ability to complete tasks in your favorite things list. Your program must complete the following rules:

- Using jQuery, add a "complete task" link at the end of each to-do item (i.e. each "favorite thing").
- When clicked, the link will cross out the current item (hint: add a class to the list that sets the text-decoration to line-through).
- Each new item added by the user needs to also have the "complete task" link at the end.

$("li:even").css("background-color", "#ccc");

*/



function addToList(list, newThing) {
	var newThingLi = document.createElement('li');
	var newThingText = document.createTextNode(newThing);
	newThingLi.appendChild(newThingText);
	list.appendChild(newThingLi);
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
