/****************************************8
 * TODO:
 * change fetch to XMLHttpRequest
*/

//TODO: https://stackoverflow.com/questions/53987666/using-promise-to-get-over-xhr-returns-pending-promise
async function loadText() {
    var res = await fetch('http://localhost:5000/text');
    text = await res.json();
    return text;
}

async function displayText() {
    text = await loadText()
    if (text === undefined || text === null)
        return ''

    let html_text = document.getElementById('text')

    for (el of text) {
        if (el.decorator.length !== 0) {
            var child_node = document.createElement(el.decorator[0]);
            el.decorator.shift();

            var inner = ''
            for (dec of el.decorator) {
                inner += '<' + dec + '>'
            }

            if (inner !== '') {
                inner += el.text
                for (dec of el.decorator)
                    inner += '</' + dec + '>'
                child_node.innerHTML = inner;
            } else {
                var child_text = document.createTextNode(el.text);
                child_node.appendChild(child_text);
            }

            html_text.appendChild(child_node);
        } else {
            var child_text_div = document.createElement('div')
            var child_text = document.createTextNode(el.text);
            child_text_div.appendChild(child_text)
            html_text.appendChild(child_text_div);
        }
    }

}

/**************************************************************
 * Function for text deletion.
 * If any text is selected it is removed.
 * If no text is selected the whole text is removed.
***************************************************************/

function removeText() {
    if (window.getSelection()) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            sel.removeRange(range)
            range.deleteContents();
        }
        else {
            let html_text = document.getElementById('text')
            html_text.innerHTML = ''
        }
    }
}


function getSelectionHtml(dec) {
    var sel, range, node;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            var html = '<' + dec + '>' + range + '</' + dec + '>'
            range.deleteContents();
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment();
            while (node = el.firstChild)
                lastNode = frag.appendChild(node);

            range.insertNode(frag);
        }
    }
}

function removeTags() {
    let html_text = document.getElementById('text');
    html_text.innerHTML = html_text.innerText.replaceAll("\n", "")  // Removes new lines which result from bullet points.
    // var sel, range, node;
}

/**************************************************************
 * Function for parsing text.
 * It takes div containing editable text and parses into the structure corresponding to the JSON file.
***************************************************************/
function parseText() {
    let html_text = document.getElementById('text');
    let jsonData = []


    for (child of html_text.childNodes) {
        var jsonObject = {}
        if (child.nodeType == Node.TEXT_NODE) {
            jsonObject["text"] = child.textContent
            jsonObject["decorator"] = []
        } else {
            var jsonObject = {}
            jsonObject["text"] = child.innerHTML.replace(/(<([^>]+)>)/gi, "");

            decorators = []
            decorators.push(child.tagName.toLowerCase());

            child_nodes = child.childNodes
            console.log(child_nodes)
            for (el of child_nodes)
                if (el.tagName !== undefined)
                    decorators.push(el.tagName.toLowerCase())

            jsonObject["decorator"] = decorators
        }
        jsonData.push(jsonObject)
    }

    console.log("parse", jsonData)
    return jsonData;
}


function saveText() {
    var parsed_text = parseText();
    console.log(JSON.stringify(parsed_text))
    try {
        fetch('http://localhost:5000/saveText', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsed_text)
        })
        result.then((sucess) => { console.log(sucess) })
    } catch (error) {
        console.log(error)
    }
}


function showManual() {
    var manual_div = document.getElementById("manual")
    if (manual_div.innerHTML !== '') {
        manual_div.innerHTML = ''
        return
    }

    var manual = "<p>Hello!</p><p>Top menu buttons:<br><b>B</b> - bolds selected text<br><i>I</i> - makes selected text italic<br>• - adds bullet points<br>trash can icon - removes all text</p><p>Bottom buttons:<br>Save - saves text<br>Reset - undo all the changes untill the last save</p>"
    manual_div.innerHTML = manual
}

const boldButton = document.getElementById('button-bold');
boldButton.addEventListener("click", () => {
    getSelectionHtml('b')
})

const italicButton = document.getElementById('button-italic');
italicButton.addEventListener("click", () => {
    getSelectionHtml('i')
})

const bulletButton = document.getElementById('button-bullet');
bulletButton.addEventListener("click", () => {
    getSelectionHtml('li')
})

const removeTagsButton = document.getElementById('button-tags');
removeTagsButton.addEventListener("click", () => {
    removeTags()
})

const removeAllButton = document.getElementById('button-remove');
removeAllButton.addEventListener("click", () => {
    removeText();
})

const helpButton = document.getElementById('button-help');
helpButton.addEventListener("click", () => {
    showManual();
})

const resetButton = document.getElementById('button-reset');
resetButton.addEventListener("click", () => {
    location.reload();
})

const saveButton = document.getElementById('button-save');
saveButton.addEventListener("click", () => {
    saveText();
})
