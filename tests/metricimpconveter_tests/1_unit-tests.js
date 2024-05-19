const chai = require("chai");
let assert = chai.assert;
const ConvertHandler = require("../../controllers/convertHandler.js");

let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
  test("Whole number input", function (done) {
    let input = "32L";
    assert.equal(convertHandler.getNum(input), 32);
    done();
  });

  test("Decimal number input", function (done) {
    let input = "32.5L";
    assert.equal(convertHandler.getNum(input), 32.5);
    done();
  });
  test("Fractional number input", function (done) {
    let input = "1/2L";
    assert.equal(convertHandler.getNum(input), 0.5);
    done();
  });
  test("Fractional input with a decimal", function (done) {
    let input = "2.5/2L";
    assert.equal(convertHandler.getNum(input), 1.25);
    done();
  });
  test("Invalid input (double fraction)", function (done) {
    let input = "2/2/2L";
    assert.equal(convertHandler.getNum(input), "invalid number");
    done();
  });

  test("No numerical input", function (done) {
    let input = "L";
    assert.equal(convertHandler.getNum(input), 1);
    done();
  });

  test("Correctly read each valid input unit", function (done) {
    let input = "32L";
    assert.equal(convertHandler.getUnit(input), "L");
    done();
  });

  test("Invalid input unit", function (done) {
    let input = "32Ls";
    assert.equal(convertHandler.getUnit(input), "invalid unit");
    done();
  });

  test("Return the correct return unit for each valid input unit", function (done) {
    let input = "32L";
    assert.equal(
      convertHandler.getReturnUnit(convertHandler.getUnit(input)),
      "gal",
    );
    done();
  });

  test("Return the spelled-out string unit for each valid input unit", function (done) {
    let input = "32L";
    assert.equal(
      convertHandler.spellOutUnit(convertHandler.getUnit(input)),
      "liters",
    );
    done();
  });

  test("Correctly convert gal to L", function (done) {
    let input = "32gal";
    assert.approximately(convertHandler.convert(32, "gal"), 121.13376, 0.1);
    done();
  });

  test("Correctly convert L to gal", function (done) {
    let input = "32L";
    assert.approximately(convertHandler.convert(32, "L"), 8.45351, 0.1);
    done();
  });
  test("Correctly convert mi to km", function (done) {
    let input = "32mi";
    assert.approximately(convertHandler.convert(32, "mi"), 51.4992, 0.1);
    done();
  });

  test("Correctly convert km to mi", function (done) {
    let input = "32km";
    assert.approximately(convertHandler.convert(32, "km"), 19.8832, 0.1);
    done();
  });

  test("Correctly convert lbs to kg", function (done) {
    let input = "32lbs";
    assert.approximately(convertHandler.convert(32, "lbs"), 14.5149, 0.1);
    done();
  });

  test("Correctly convert kg to lbs", function (done) {
    let input = "32kg";
    assert.approximately(convertHandler.convert(32, "kg"), 70.5479, 0.1);
    done();
  });
});
