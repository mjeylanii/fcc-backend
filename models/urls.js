const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  original_url: { type: String, require: true, unique: true },
  short_url: { type: Number, require: true, unique: true },
});

module.exports = mongoose.model("Url", urlSchema);
