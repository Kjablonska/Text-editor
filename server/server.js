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
var cors = require('cors')
const app = express();
app.use(cors({origin: true}))
app.use(express.json());

const assets_dir = '../assets'
let file_name = '../assets/test.json'

const port = 5000;

app.listen(port, () => {
    console.log("server started on port 5000");
});



app.get('/text', async (_, res) => {
    console.log("text")
    console.log("filename " + file_name)

    const fs = require('fs').promises;
    let r = await fs.readFile(file_name, 'utf8')
        .then(x => JSON.parse(x))
    console.log(r)
    res.json(r);
})


app.post('/saveText', (req, res) => {
    console.log(req.body)
    const fs = require('fs').promises;
    const jsonContent = JSON.stringify(req.body);
    if (jsonContent !== undefined) {
        fs.writeFile(file_name, jsonContent, 'utf8', function (err) {
            if (err)
                return console.log("error");
        });
    }
    res.json("res")
})

const getJsonFile = () => {
    var files = fs.readdirSync(assets_dir);
    const path = require('path');

    for(var f in files)
        if(path.extname(files[f]) === ".json")
            file_name = file[f]

}