const Url = require("../models/urls");
const User = require("../models/user");

module.exports = function (app) {
  app.post("/api/exercise/new-user", function (req, res) {
    let username = req.body.username;
    if (username == "") {
      return res.json({ error: "username is required" });
    }
  });
};
