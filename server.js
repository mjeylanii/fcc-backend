require("dotenv").config();

var express = require("express");

var app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

//MongoDB
let mongoose = require("mongoose");
let uri = process.env.MONGO_URI;

const runner = require("./test-runner");

//Routes
const exerciseTrackerRoutes = require("./routes/exercise_tracker.api.js");
const microservicesRoutes = require("./routes/microservices.api.js");
const metricImpConverterRoutes = require("./routes/metric_imp_converter.api.js");
const sudokuSolverRoutes = require("./routes/sudoku_solver.api.js");

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// middlewares -------------------------------------
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer().single("upfile"));
//---------------------------------------------------

//Routes --------------------------------------------
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

exerciseTrackerRoutes(app);
microservicesRoutes(app);
metricImpConverterRoutes(app);
sudokuSolverRoutes(app);

//---------------------------------------------------
//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

const port = process.env.PORT || 3000;
//Start our server and tests!
app.listen(port, function () {
  console.log("Listening on port " + port);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        console.log("Tests are not valid:");
        console.error(e);
      }
    }, 1500);
  }
});

module.exports = app;
