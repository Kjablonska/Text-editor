const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const file_name = '../assets/text.json';
const port = 5000;

app.listen(port, () => {
    console.log("server started on port 5000");
});

app.get('/text', async (_, res) => {
    const fs = require('fs').promises;
    const text = await fs.readFile(file_name, 'utf8')
        .then(x => JSON.parse(x));

    res.json(text);
});


app.post('/saveText', (req, res) => {
    const fs = require('fs').promises;
    let jsonContent = JSON.stringify(req.body);
    if (jsonContent !== undefined) {
        fs.writeFile(file_name, jsonContent, 'utf8', function (err) {
            if (err)
                res.json(err);
            res.json("Text saved sucessfully.");
        });
    }
    res.json("Unable to save text.");

});