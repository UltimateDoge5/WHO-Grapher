const express = require("express");
const app = express();
const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/html/index.html"));
});



app.use('/public', express.static(path.join(__dirname, 'public')));
app.listen(process.env.PORT || 8080);