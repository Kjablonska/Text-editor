

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

function resetAllText() {
    let html_text = document.getElementById('text')
    html_text.innerHTML = ''
}


function getSelectionHtml(dec) {
    var sel, range, node;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = window.getSelection().getRangeAt(0);
            var parent = range.startContainer.nextSibling
            console.log("startcontainer", parent)
            var html = '<' + dec + '>' + range + '</' + dec + '>'
            range.deleteContents();
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
        }
    }
    // } else if (document.selection && document.selection.createRange) {
    //     range = document.selection.createRange();
    //     range.collapse(false);
    //     range.pasteHTML(html);
    // }
}

function removeTags() {
    var sel, range, node;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = window.getSelection().getRangeAt(0);
            var html = range.toString();
            range.deleteContents();
            var el = document.createElement("div");
            el.innerHTML = html;
            range.insertNode(el);
        }
    }
}

// TODO: change it so as it won't remove nodes.
function parseText() {
    let html_text = document.getElementById('text');
    console.log(html_text.firstElementChild.tagName);
    let jsonData = []


    while (html_text.firstElementChild) {
        var child = html_text.firstElementChild
        var jsonObject = {}
        jsonObject["text"] = child.innerHTML.replace(/(<([^>]+)>)/gi, "");

        decorators = []
        decorators.push(child.tagName.toLowerCase());
        while (child.firstElementChild) {
            decorators.push(child.firstElementChild.tagName.toLowerCase())
            child.removeChild(child.firstElementChild)
        }

        jsonObject["decorator"] = decorators
        jsonData.push(jsonObject)
        html_text.removeChild(html_text.firstChild);
    }

    console.log(jsonData)
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
    var manual = 'Hello! Top menu: Buttons at the bottom: '
    window.alert(manual)
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
    resetAllText();
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


// function getSelectionHtml() {
//   var html = "";
//   if (typeof window.getSelection != "undefined") {
//       var sel = window.getSelection();
//       if (sel.rangeCount) {
//           var container = document.createElement("div");
//           for (var i = 0, len = sel.rangeCount; i < len; ++i) {
//               container.appendChild(sel.getRangeAt(i).cloneContents());
//           }
//           html = container.innerHTML;
//       }
//   }
//   // else if (typeof document.selection != "undefined") {
//   //     if (document.selection.type == "Text") {
//   //         html = document.selection.createRange().htmlText;
//   //     }
//   // }
//   console.log(html)
//   return html;
// }