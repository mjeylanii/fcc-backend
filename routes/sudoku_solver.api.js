"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

let coordinateRegex = /^[A-I][1-9]$/;

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    if (!req.body.puzzle || !req.body.coordinate || !req.body.value)
      return res.json({ error: "Required field(s) missing" });

    const { puzzle, coordinate, value } = req.body;

    if (!value || !coordinate || !puzzle)
      return res.json({ error: "Required field(s) missing" });

    if (validateCheckInput(puzzle)) return res.json(validateCheckInput(puzzle));

    if (!coordinate.match(coordinateRegex))
      return res.json({ error: "Invalid coordinate" });

    if (!value.match(/^[1-9]$/)) return res.json({ error: "Invalid value" });

    let row = coordinate[0].charCodeAt(0) - "A".charCodeAt(0);
    let col = parseInt(coordinate[1]) - 1;

    let solution = solver.solve(puzzle);

    if (solution) {
      if (solution[row][col] === value) return res.json({ valid: true });
    }

    let conflict = solver.findConflicts(puzzle, row, col, value);

    res.json({ valid: false, conflict });
  });

  app.route("/api/solve").post((req, res) => {
    if (!req.body.puzzle) return res.json({ error: "Required field missing" });

    let puzzle = req.body.puzzle;
    const validate = validateCheckInput(puzzle);

    if (validate) return res.json(validate);

    if (!solver.solve(puzzle))
      return res.json({ error: "Puzzle cannot be solved" });

    const solution = solver.solve(puzzle).flat().join("");
    res.json({ solution });
  });
};

//Validate the input for check route
const validateCheckInput = (puzzle) => {
  if (!puzzle || puzzle.length !== 81) {
    return { error: "Expected puzzle to be 81 characters long" };
  }
  if (!puzzle.match(/^[1-9.]+$/)) {
    return { error: "Invalid characters in puzzle" };
  }

  return null;
};
