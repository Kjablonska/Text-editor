/**************************************************
 *
 * Sever in Node.js using Express library.
 * Responsibilities:
 *  - parsinng JSON file.
 *  - saving formatted text as a JSON file.
 *
***************************************************/

/**************************************************
 *
 * JSON file format:
 * Data in JSON file is stored as a JSON array, each entry has text filed and decorator value.
 * Each entry filed represents the group of text having the same decorator.
 * JSON array represents the order of the text.
 *
***************************************************/

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

let file_name = '../assets/text.json';
const port = 5000;

app.listen(port, () => {
    console.log("server started on port 5000");
});

app.get('/text', async (_, res) => {
    const fs = require('fs').promises;
    let text = await fs.readFile(file_name, 'utf8')
        .then(x => JSON.parse(x));

    res.json(text);
});


app.post('/saveText', (req, res) => {
    console.log(req.body);
    const fs = require('fs').promises;
    const jsonContent = JSON.stringify(req.body);
    if (jsonContent !== undefined) {
        fs.writeFile(file_name, jsonContent, 'utf8', function (err) {
            if (err)
                res.json(err);
            res.json("Text saved sucessfully.");
        });
    }
    res.json("Unable to save text.");

});