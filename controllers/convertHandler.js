function ConvertHandler() {
  this.getNum = function (input) {
    const index = input.search(/[a-zA-Z]/);
    const number = input.slice(0, index);
    if (number === "0") return "invalid number";
    //Check forward slash
    if (number.includes("/")) {
      const arr = number.split("/");
      if (arr.length > 2) return "invalid number";
      return arr[0] / arr[1];
    }

    if (number === "") return 1;
    return number;
  };

  this.getUnit = function (input) {
    const index = input.search(/[a-zA-Z]/);
    if (index === -1) return "invalid unit";

    const unit = input.slice(index);
    if (unit === "l" || unit === "L") {
      return "L";
    }
    switch (unit.toLowerCase()) {
      case "gal":
        return "gal";
      case "lbs":
        return "lbs";
      case "kg":
        return "kg";
      case "mi":
        return "mi";
      case "km":
        return "km";
      default:
        return "invalid unit";
    }
  };

  this.getReturnUnit = function (initUnit) {
    switch (initUnit) {
      case "gal":
        return "L";
      case "L":
        return "gal";
      case "lbs":
        return "kg";
      case "kg":
        return "lbs";
      case "mi":
        return "km";
      case "km":
        return "mi";
      default:
        return "invalid unit";
    }
  };

  this.spellOutUnit = function (unit) {
    switch (unit) {
      case "gal":
        return "gallons";
      case "L":
        return "liters";
      case "lbs":
        return "pounds";
      case "kg":
        return "kilograms";
      case "mi":
        return "miles";
      case "km":
        return "kilometers";
      default:
        return "invalid unit";
    }
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    switch (initUnit) {
      case "gal":
        return initNum * galToL;
      case "L":
        return initNum / galToL;
      case "lbs":
        return initNum * lbsToKg;
      case "kg":
        return initNum / lbsToKg;
      case "mi":
        return initNum * miToKm;
      case "km":
        return initNum / miToKm;
      default:
        return "invalid unit";
    }
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    switch (initNum) {
      case "invalid number":
        return "invalid number";
      case "invalid unit":
        return "invalid unit";
      default:
        return `${initNum} ${this.spellOutUnit(
          initUnit
        )} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
    }
  };
}

module.exports = ConvertHandler;
