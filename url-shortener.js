require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");
let mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect(
  "mongodb+srv://mojeyo:hOQieMx61Hf6AWQM@cluster0.2oivgw3.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
// Basic Configuration
const port = process.env.PORT || 3000;

//A a mongoose url scheme
const urlSchema = new Schema({
  original_url: { type: String, require: true, unique: true },
  short_url: { type: Number, require: true, unique: true },
});


let Url = mongoose.model("Url", urlSchema);

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  let regexUrl = /(^\w+:|^)\/\//;
  let url = req.body.url;
  console.log(url);
  if (url == "" || regexUrl.test(url) == false) {
    return res.json({ error: "invalid url" });
  } else {
    let cleanUrl = cleanUrl(url);
    var dnsLookup = dns.lookup(cleanUrl, async function (err, ip) {
      console.log(err);
      console.log(cleanUrl);
      if (err) return res.json({ error: "invalid url" });
      //Check if url exists
      findUrl(url).then((data) => {
        if (data.length == 0) {
          console.log("URL not found in database. Creating new document");
          //If doesn't exist, create new document
          let result = createUrl(url).then((data) => {
            console.log(data);
            //Display new shortened URL data
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

async function findUrl(url, shortUrl) {
  if (url == "" && shortUrl !== "") {
    let result = await Url.find({ short_url: shortUrl }).then((res) => {
      return res;
    });
    return result;
  } else {
    let result = await Url.find({ original_url: url }).then((res) => {
      return res;
    });
    return result;
  }
}
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
      //console.log(data)
      //res.json({url: data[0].original_url, short_url: data[0].short_url})
    }
  });
});

async function createUrl(url) {
  let count = 0;
  let result = await Url.countDocuments({}).then(async (res) => {
    count = parseInt(res);
    count++;
    const newUrl = new Url({ original_url: url, short_url: count });
    return await newUrl.save().then((res) => {
      return res;
    });
  });
  return result;
}

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
