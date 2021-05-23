# Text editor
Simple text editor developed using vanilla JS and Node.js on backend side.

# Description
The aim of this project is to develop a simple text editor which supports bolding, italics and bullet points.  
The text is stored as a JSON file in assetes/text.json.  
It is possible to save the text.  
The app does not support Internet Explorer, as it uses the fetch api. If the user's browser is IE, information on browser support is displayed.

# Run&build
  1. Go to the server directory and type in the terminal ```npm install node express```.   
      After all is installed execute: ```node server.js```.
  2. Go to the browser and put ```index.html``` file there.

# Options
Top menu:
  * <b>B</b>    -   bolds the selected text,
  * <i>I</i>    -   makes the selected text italic,
  * •           -   adds bullet points,
  * &#128465;&#65039; (Trash Can emoji)   -   if any text is selected: removes the text, else: removes the whole text,
  * &#129488; (Face with Monocle emoji)   -   displays manual.

Bottom buttons:
  * Save    -   saves the current text.
  * Reset   - restores the last saved text.


# Demo

![alt text](https://github.com/Kjablonska/Text-editor/blob/assets/text-editor.gif)
