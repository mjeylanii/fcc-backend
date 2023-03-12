// imports
require("dotenv").config();
const Url = require("./models/urls");
const User = require("./models/user");
var express = require("express");
const { cleanUrl, createUrl, findUrl } = require("./utils");
var app = express();
const port = process.env.PORT || 3000;
var cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");
let mongoose = require("mongoose");
let uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// middlewares
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
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
app.get("/api/date/:date?", function (req, res) {
  let dateString = req.params.date;
  if (!dateString) {
    dateString = new Date().getTime().toString();
  }
  let date;
  // Check if dateString is a Unix timestamp
  if (/^[0-9]+$/.test(dateString)) {
    date = new Date(parseInt(dateString));
  }
  // Check if dateString is a valid date string
  else {
    date = new Date(dateString);
  }
  // Use current date if date is invalid
  if (date.toString() === "Invalid Date") {
    res.json({ error: "Invalid Date" });
  } else {
    res.json({
      unix: date.valueOf(),
      utc: date.toUTCString(),
    });
  }
});

//URL Shortener Microservice
app.post("/api/shorturl", function (req, res) {
  let regexUrl = /(^\w+:|^)\/\//;
  let url = req.body.url;
  console.log(req.body);
  console.log(url);
  if (url == "" || regexUrl.test(url) == false) {
    return res.json({ error: "invalid url" });
  } else {
    dnsLookup = dns.lookup(cleanUrl(url), async function (err, ip) {
      if (err) return res.json({ error: "invalid url" });
      //Check if url exists
      await findUrl(url).then((data) => {
        if (data.length == 0) {
          console.log("URL not found in database. Creating new document");
          //If doesn't exist, create new document
          let result = createUrl(url).then((data) => {
            res.json({
              original_url: data.original_url,
              short_url: data.short_url,
            });
          });
        } else {
          //Display shortened URL data
          res.json({
            original_url: data[0].original_url,
            short_url: data[0].short_url,
          });
        }
      });
    });
  }
});

app.get("/api/shorturl/:url", async function (req, res) {
  let regex = /[0-9]+/g;
  url = req.params.url;
  if (url == "" || regex.test(url) == false) {
    return res.json({ error: "invalid url" });
  }
  let result = await findUrl("", url).then((data) => {
    if (data.length == 0) {
      return res.json({ error: "not found" });
    } else {
      res.redirect(data[0].original_url);
    }
  });
});

//Exercise Tracker
app.post("/api/exercise/new-user", function (req, res) {
  let username = req.body.username;
  if (username == "") {
    return res.json({ error: "username is required" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
