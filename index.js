const express = require("express"); //NODE JS server
const app = express();
const path = require("path");
const https = require('https');
const fs = require("fs");

app.get("/", (req, res) => { //If no langege specified, display english version
    res.redirect("/en")
})

app.get("/:language", (req, res) => { //Try to find index with given language code
    fs.access(path.join(__dirname + `/public/html/index-${req.params.language}.html`), fs.F_OK, (err) => {
        if (err) { //If given code does not exist display english version
            res.redirect("/en")
        }
        res.sendFile(path.join(__dirname + `/public/html/index-${req.params.language}.html`));
    })
});

app.get("/api/:codes", (req, res) => { //Connecting to api from the server because of the borken CORS of the WHO api
    let codes = req.params.codes.split(",")
    if (codes.length < 1) {
        res.send("Minimum one code required")
        return false;
    }

    let url = "https://apps.who.int/gho/athena/data/GHO/";
    let buffer = "";
    for (code of codes) { //Adding all the codes of data needed
        if (buffer != "") {
            buffer += ",";
        }
        buffer += code;
    }
    url += buffer;

    url += `.json?profile=simple`; //Assemble the url

    if (req.query.country != undefined) {
        url += `&filter=COUNTRY:${req.query.country.toUpperCase()}` //Filter with country if given
    }
    console.log(url)
    https.get(url, (resp) => {
        let data = '';

        resp.on('data', (chunk) => { // A chunk of data has been recieved
            data += chunk;
        });

        resp.on('end', () => { // The whole response has been received. Parse the result
            if (!isJson(data)) {
                res.json({ error: "Wrong request" });
                return false;
            }
            res.json(JSON.parse(data));
        });
    }).on("error", (err) => {
        throw err;
    });
})

app.get("/get/borders", (req, res) => {
    const borderJson = JSON.parse(fs.readFileSync(path.join(__dirname, "/borders.json"), 'UTF-8'));
    res.json(borderJson);
});

function isJson(json) { //Check if server response is a valid JSON
    try {
        JSON.parse(json);
    } catch (e) {
        return false;
    }
    return true;
}

app.use('/public', express.static(path.join(__dirname, 'public'))); //Provide acces to nessesary files

app.use(function(req, res, next) { //Handle 404 error
    res.status(404);
    res.send("Error 304 Page not found")
});
app.listen(process.env.PORT || 8080);