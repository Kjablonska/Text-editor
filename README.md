# Text editor

Simple text editor developed using vanilla JS and Node.js on the backend side.

# Description

The aim of the project was to develop simple text editor allowing for bolding the text, make it italic and adding bullet points.  
The text is stored as a JSON file - see the file structure [here](text-editor/README.md).  
There is a possibility to save the text. In such case, the program parses it into the above JSON structure.  

# Options:
Top menu:
  * <b>B</b>   -   bolds the selected text,
  * <i>I</i>   -   makes the selected text italic,
  * •   -   adds bullet points,
  * &#128465;&#65039; - if any text is selected: removes the text, else: removes the whole text,
  * &#129488;   -   displays manual.
  
Bottom buttons:
  * Save    -   saves the current text.
  * Reset   - restores the last saved text.
