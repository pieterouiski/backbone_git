backbone_git
============

Backbone application showing Git activity for a given repository


Requirements:

Make a small Backbone app using the Github API

Using the Github API (http://developer.github.com/), create a client-side, Backbone.js-based app that displays some interesting data on a public repository - whichever of your choosing. A popular one with a good number of contributors is recommended such as Backbone.js - to give you better data to work with.

Specifically, create a page which displays the following data:

1. The last 5 commits
2. The top 5 committers and their commit count over the last 100 commits.
3. Commits per day (or other meaningful time slice, depending on the data). This list should be sortable by # of commits.

Display these 3 pieces of data in 3 side-by-side columns.

Use the http://developer.github.com/v3/repos/collaborators/ API to return a list of "slackers" who have previously committed to the codebase, but haven't contributed in the last 100 commits. Those lazy bums should be called out and shamed into committing some code to the codebase.

(Extra Credit):

Add a pagination button on the page - where when clicked, shows the above data on the next 100 commits on the repro

(Extra Extra Credit):

For column #3 above, allow for input of various time intervals



Written by:  Bill Pieterouiski  (pieterouiski@gmail.com)
