# Text editor
Author: Karolina Jabłońska
The program does not support Internet Explorer!
# Run&build
  1. Go to the server directory and type in the terminal node server.js.
  2. Go to the browser and put index.html file there.
# Description
The aim of the project was to develop simple text editor allowing for bolding the text, make it italic and adding bullet points.
The text is stored as a JSON file - see the file structure assetes/text.json.
There is a possibility to save the text. In such case, the program parses it into the above JSON structure.
If user's browser is IE, an information about browser not being supported is displayed.

# Options:
Top menu:
  * <b>B</b>    -   bolds the selected text,
  * <i>I</i>    -   makes the selected text italic,
  * •           -   adds bullet points,
  * &#128465;&#65039; (Trash Can emoji)   -   if any text is selected: removes the text, else: removes the whole text,
  * &#129488; (Face with Monocle emoji)   -   displays manual.

Bottom buttons:
  * Save    -   saves the current text.
  * Reset   - restores the last saved text.
