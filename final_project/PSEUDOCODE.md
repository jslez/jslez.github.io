# Overall approach / pseudo code

- get the articles
- make an array filled with article objects (fine to keep the newsAPI object structure)
- make whatever object the bubble chart needs
- draw a bubble chart by topic, showing which have the most facebook shares. big bubble is topic, inner bubble is articles (size = shares)


New idea:
* Pull a list of articles
* Categorize into category and sub-category
* Make a zoomable circle packing of the articles, where size of the bubbles corresponds to number of shares
* Color of the bulbbles is how much they're trending (say)

approach:
* see if we can pull a list of articles into an object/array
* see if we can categorize each with the external API

… then eventually see if we can structure the data to show it in the bubble graph

- - - - - - 
* Pull the top articles from a list of hard-coded sources
* Loop through each article
* For each article, display it in the feed if its topic matches the hardcoded topic chosen (later: allow user to change this)

