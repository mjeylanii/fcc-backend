require("dotenv").config();
var express = require("express");
var message = process.env.MESSAGE;
var app = express();
const port = process.env.PORT || 3000;
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  console.log(message);
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

//Header Parser Microservice
app.get("/api/whoami", function (req, res) {
  res.json({
    ipaddress: req.headers["x-forwarded-for"],
    language: req.headers["accept-language"],
    software: req.headers["user-agent"],
  });
});

//Timestamp Microservice
app.get("/api/:date?", function (req, res) {
  let params = req.params.date;

  if (!params) {
    params = new Date().getTime().toString();
  }
  let date;
  // Check if params is a Unix timestamp
  if (/^[0-9]+$/.test(params)) {
    date = new Date(parseInt(params));
  }
  // Check if params is a valid date string
  else {
    date = new Date(params);
  }
  // Use current date if date is invalid
  if (date.toString() === "Invalid Date") {
    res.json({ error: "Invalid Date" });
  } else {
    res.json({
      unix: date.getTime(),
      utc: date.toUTCString(),
    });
  }
});


//URL Shortener Microservice
app.post("/api/shorturl", function (req, res) {
  //Remove protocols from url
  let regex = /^(?:https?:\/\/)?(?:www\.)?/i;
  let url = req.body.url;
  if (url == "") return res.json({ error: "Url cannot be empty" });

  var dnsLookup = dns.lookup(url, function (err, addresses) {
    if (err) return console.log(err);
    console.log(addresses);
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
