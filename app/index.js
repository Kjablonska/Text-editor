function checkBrowser() {
    let userAgentString = navigator.userAgent;
    let IExplorerAgent = userAgentString.indexOf("MSIE") > -1 || userAgentString.indexOf("rv:") > -1;
    if (IExplorerAgent) {
        let browser_check = document.getElementById("browser-check");
        let not_supported_text = "<p>Hello!</p><p>Your web browser is not supported. :( </p>";
        let not_supported = document.createTextNode(not_supported_text);
        browser_check.appendChild(not_supported);
        return;
    }
}


async function loadText() {
    let res = await fetch('http://localhost:5000/text');
    text = await res.json();
    return text;
}

async function displayText() {
    checkBrowser();
    text = await loadText();
    if (text === undefined || text === null)
        return '';

    let html_text = document.getElementById('text');

    for (el of text) {
        if (el.decorator.length !== 0) {
            let child_node = document.createElement(el.decorator[0]);
            el.decorator.shift();

            let inner = '';
            for (dec of el.decorator)
                inner += '<' + dec + '>';

            if (inner !== '') {
                inner += el.text;
                for (dec of el.decorator)
                    inner += '</' + dec + '>';
                child_node.innerHTML = inner;
            } else {
                let child_text = document.createTextNode(el.text);
                child_node.appendChild(child_text);
            }

            html_text.appendChild(child_node);
        } else {
            let child_text_div = document.createElement('div');
            let child_text = document.createTextNode(el.text);
            child_text_div.appendChild(child_text);
            html_text.appendChild(child_text_div);
        }
    }

}


/**
 * Function for text deletion.
 * If any text is selected it is removed.
 * If no text is selected the whole text is removed.
 */
function removeText() {
    if (window.getSelection()) {
        let sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount != 0) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            sel = window.getSelection ? window.getSelection() : document.selection;
            removeSelection();
        }
        else {
            let html_text = document.getElementById('text');
            html_text.innerHTML = '';
        }
    }
}


function styleSelectedText(dec) {
    if (window.getSelection) {
        let sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            let range = sel.getRangeAt(0);
            let html = '<' + dec + '>' + range + '</' + dec + '>';
            range.deleteContents();
            let el = document.createElement("div");
            el.innerHTML = html;
            let new_fragment = document.createDocumentFragment();
            var node;
            while (node = el.firstChild)
                lastNode = new_fragment.appendChild(node);

            range.insertNode(new_fragment);
        }
        removeSelection();
    }
}

function removeTags() {
    let html_text = document.getElementById('text');
    html_text.innerHTML = html_text.innerText.replaceAll("\n", "");  // Removes new lines which result from bullet points.
}

function removeSelection() {
    let sel = window.getSelection ? window.getSelection() : document.selection;
    if (sel) {
        if (sel.removeAllRanges)
            sel.removeAllRanges();
        else if (sel.empty)
            sel.empty();
    }
}


/**
 * Function for parsing text.
 * It takes div containing editable text and parses into the structure corresponding to the JSON file.
 */
function parseText() {
    let html_text = document.getElementById('text');
    let jsonData = [];


    for (child of html_text.childNodes) {
        let jsonObject = {};
        if (child.nodeType == Node.TEXT_NODE) {
            jsonObject["text"] = child.textContent;
            jsonObject["decorator"] = [];
        } else {
            let jsonObject = {};
            jsonObject["text"] = child.innerHTML.replace(/(<([^>]+)>)/gi, "");

            decorators = [];
            decorators.push(child.tagName.toLowerCase());

            child_nodes = child.childNodes;
            for (el of child_nodes)
                if (el.tagName !== undefined)
                    decorators.push(el.tagName.toLowerCase());

            jsonObject["decorator"] = decorators;
        }
        jsonData.push(jsonObject);
    }

    return jsonData;
}


function saveText() {
    let parsed_text = parseText();
    try {
        fetch('http://localhost:5000/saveText', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsed_text)
        });
    } catch (error) {
        console.log(error);
    }
}


function showManual() {
    let manual_div = document.getElementById("manual");
    if (manual_div.innerHTML !== '') {
        manual_div.innerHTML = '';
        return;
    }

    let manual = "<p>Hello!</p><p>Top menu buttons:<br><b>B</b> - bolds selected text<br><i>I</i> - makes selected text italic<br>• - adds bullet points<br>trash can icon - removes all text</p><p>Bottom buttons:<br>Save - saves text<br>Reset - undo all the changes untill the last save</p>";
    manual_div.innerHTML = manual;
}

const boldButton = document.getElementById('button-bold');
boldButton.addEventListener("click", () => {
    styleSelectedText('b');
});

const italicButton = document.getElementById('button-italic');
italicButton.addEventListener("click", () => {
    styleSelectedText('i');
});

const bulletButton = document.getElementById('button-bullet');
bulletButton.addEventListener("click", () => {
    styleSelectedText('li');
});

const removeTagsButton = document.getElementById('button-tags');
removeTagsButton.addEventListener("click", () => {
    removeTags();
});

const removeAllButton = document.getElementById('button-remove');
removeAllButton.addEventListener("click", () => {
    removeText();
});

const helpButton = document.getElementById('button-help');
helpButton.addEventListener("click", () => {
    showManual();
});

const resetButton = document.getElementById('button-reset');
resetButton.addEventListener("click", () => {
    location.reload();
});

const saveButton = document.getElementById('button-save');
saveButton.addEventListener("click", () => {
    saveText();
});
