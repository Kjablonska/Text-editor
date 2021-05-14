async function loadText() {
    const res = await fetch('http://localhost:5000/text');
    return await res.json();
}

async function displayText() {
    const text = await loadText();
    if (text === undefined || text === null)
        return '';

    const htmlText = document.getElementById('text');

    for (const el of text) {
        if (el.decorator.length !== 0) {
            const childNode = document.createElement(el.decorator[0]);
            el.decorator.shift();

            let inner = '';
            for (const dec of el.decorator)
                inner += '<' + dec + '>';

            if (inner !== '') {
                inner += el.text;
                for (const dec of el.decorator)
                    inner += '</' + dec + '>';
                childNode.innerHTML = inner;
            } else {
                const childText = document.createTextNode(el.text);
                childNode.appendChild(childText);
            }

            htmlText.appendChild(childNode);
        } else {
            const childTextDiv = document.createElement('div');
            const childText = document.createTextNode(el.text);
            childTextDiv.appendChild(childText);
            htmlText.appendChild(childTextDiv);
        }
    }

}

function removeText() {
    if (window.getSelection()) {
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount != 0) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            removeSelection();
        } else {
            const htmlText = document.getElementById('text');
            htmlText.innerHTML = '';
        }
    }
}

function styleSelectedText(dec) {
    if (window.getSelection) {
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            const range = sel.getRangeAt(0);
            const html = '<' + dec + '>' + range + '</' + dec + '>';
            range.deleteContents();
            const el = document.createElement("div");
            el.innerHTML = html;
            const newFragment = document.createDocumentFragment();
            let node;
            while (node = el.firstChild)
                lastNode = newFragment.appendChild(node);

            range.insertNode(newFragment);
        }
        removeSelection();
    }
}

function removeTags() {
    const htmlText = document.getElementById('text');
    htmlText.innerHTML = htmlText.innerText.replaceAll("\n", "");  // Removes new lines which result from bullet points.
}

function removeSelection() {
    const sel = window.getSelection ? window.getSelection() : document.selection;
    if (sel) {
        if (sel.removeAllRanges)
            sel.removeAllRanges();
        else if (sel.empty)
            sel.empty();
    }
}

function parseText() {
    const htmlText = document.getElementById('text');
    const jsonData = [];

    for (const child of htmlText.childNodes) {
        const jsonObject = {};
        if (child.nodeType == Node.TEXT_NODE) {
            jsonObject["text"] = child.textContent;
            jsonObject["decorator"] = [];
        } else {
            const decorators = [];
            jsonObject["text"] = child.innerHTML.replace(/(<([^>]+)>)/gi, "");
            decorators.push(child.tagName.toLowerCase());
            childNodes = child.childNodes;
            for (const el of childNodes)
                if (el.tagName !== undefined)
                    decorators.push(el.tagName.toLowerCase());

            jsonObject["decorator"] = decorators;
        }

        if (jsonObject !== {})
            jsonData.push(jsonObject);
    }

    return jsonData;
}

function saveText() {
    const parsed_text = parseText();
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
        console.error(error);
    }
}

function showManual() {
    const manualDiv = document.getElementById("manual");
    if (manualDiv.innerHTML !== '') {
        manualDiv.innerHTML = '';
        return;
    }

    const manual = "<p>Hello!</p><p>Top menu buttons:<br><b>B</b> - bolds selected text<br><i>I</i> - makes selected text italic<br>• - adds bullet points<br>&#128465;&#65039; - removes selected text. If no text is selected - removes all text<br>&#129488; - displays manual</p><p>Bottom buttons:<br>Save - saves text<br>Reset - undo all the changes till the last save</p>";
    manualDiv.innerHTML = manual;
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
