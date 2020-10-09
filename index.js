const express = require("express"); //NODE JS server
const app = express();
const path = require("path");
const https = require('https');

app.get("/", (req, res) => { //Send index.html
    res.sendFile(path.join(__dirname + "/public/html/index.html"));
});

app.get("/api/:codes", (req, res) => { //Connecting to api from the server because of the borken CORS of the WHO api
    let codes = req.params.codes.split(",")
    if (codes.length < 1) {
        res.send("Minimum one code required")
        return false;
    }
    if (req.query.country == undefined) {
        res.send("Country needed")
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
    url += `.json?profile=simple&filter=COUNTRY:${req.query.country.toUpperCase()}`; //Assemble the url

    https.get(url, (resp) => {
        let data = '';
        // A chunk of data has been recieved
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received. Parse the result
        resp.on('end', () => {
            if (!isJson(data)) {
                res.json({ error: "Wrong request" })
                return false;
            }
            res.json(JSON.parse(data));
        });
    }).on("error", (err) => {
        throw ("Error: " + err.message);
    });
})

function isJson(json) { //Check if server response is valid JSON
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
