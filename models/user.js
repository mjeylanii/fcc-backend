const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  description: { type: String, require: true },
  duration: { type: Number, require: true },
  date: { type: Date, require: true },
});

module.exports = mongoose.model("User", userSchema);
