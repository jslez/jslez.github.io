// 99 BOTTLES OF BEER
// Write a script that prints the lyrics to "99 Bottles of Beer on the Wall" in the terminal
// Make sure your program can handle both singular and plural cases (i.e. both "100 bottles of beer" and "1 bottle of beer")
// Hint: you will want to use a for loop that starts at 99 and counts down to 0
// 

// Idea: start with the first line of the lyric and just make replacements in the
// string for each subsequent line
var startLyric = "99 bottles of beer on the wall, 99 bottles of beer. Take one down and pass it around, 98 bottles of beer on the wall."
for (i=0; i < 99; i++) {
   var output = startLyric.replace(/99/g, (99-i).toString() ); //global replace using a regular expression
   var output = output.replace(/98/g, (98-i).toString() );
   var output = output.replace(/1 bottles/g, "1 bottle"); //use singular when quantity is 1
   console.log(output);
}   