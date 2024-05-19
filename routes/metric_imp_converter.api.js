"use strict";

const expect = require("chai").expect;

const ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function (app) {
  let convertHandler = new ConvertHandler();

  app.route("/api/convert").get((req, res) => {
    const input = req.query.input ? req.query.input : 1;
    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);
    const returnUnit = convertHandler.getReturnUnit(initUnit);
    if (initNum === "invalid number" && returnUnit === "invalid unit") {
      res.json("invalid number and unit");
      return;
    }

    if (initNum === "invalid number") {
      res.json("invalid number");
      return;
    }

    if (returnUnit === "invalid unit") {
      res.json("invalid unit");
      return;
    }

    const returnNum = Number(
      convertHandler.convert(initNum, initUnit).toFixed(5),
    );
    const string = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit,
    );
    res.json({ initNum, initUnit, returnNum, returnUnit, string });
  });
};
