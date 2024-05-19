const chai = require("chai");
const assert = chai.assert;
const { puzzlesAndSolutions } = require("../../controllers/puzzle-strings");
const Solver = require("../../controllers/sudoku-solver.js");
let solver;

suite("Sodoku solver Unit Tests", () => {
  suiteSetup(() => {
    solver = new Solver();
  });

  test("Logic handles a valid puzzle string of 81 characters", function () {
    let puzzle = puzzlesAndSolutions[0][0];
    assert.equal(solver.validate(puzzle), true);
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
    let puzzle = puzzlesAndSolutions[0][0].replace("1", "A");
    assert.equal(solver.validate(puzzle), false);
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function () {
    let puzzle = puzzlesAndSolutions[0][0].slice(1);
    assert.equal(solver.validate(puzzle), false);
  });

  test("Logic handles a valid row placement", function () {
    let puzzleString = puzzlesAndSolutions[0][0].split("");

    let board = [];

    for (let i = 0; i < 9; i++) {
      board.push(puzzleString.slice(i * 9, i * 9 + 9));
    }

    assert.equal(solver.checkRowPlacement(board, 1, 0, 5), true);
  });

  test("Logic handles an invalid row placement", function () {
    let puzzleString = puzzlesAndSolutions[0][0].split("");

    let board = [];

    for (let i = 0; i < 9; i++) {
      board.push(puzzleString.slice(i * 9, i * 9 + 9));
    }

    assert.equal(solver.checkRowPlacement(board, 0, 1, 1), false);
  });

  test("Logic handles a valid column placement", function () {
    let puzzleString = puzzlesAndSolutions[0][0].split("");

    let board = [];

    for (let i = 0; i < 9; i++) {
      board.push(puzzleString.slice(i * 9, i * 9 + 9));
    }

    assert.equal(solver.checkColPlacement(board, 0, 1, 3), true);
  });

  test("Logic handles an invalid column placement", function () {
    let puzzleString = puzzlesAndSolutions[0][0].split("");

    let board = [];

    for (let i = 0; i < 9; i++) {
      board.push(puzzleString.slice(i * 9, i * 9 + 9));
    }

    assert.equal(solver.checkColPlacement(board, 0, 0, 5), true);
  });

  test("Logic handles a valid region (3x3 grid) placement", function () {
    let puzzleString = puzzlesAndSolutions[0][0].split("");

    let board = [];

    for (let i = 0; i < 9; i++) {
      board.push(puzzleString.slice(i * 9, i * 9 + 9));
    }

    assert.equal(solver.checkRegionPlacement(board, 0, 0, 1), false);
  });

  test("Logic handles an invalid region (3x3 grid) placement", function () {
    let puzzleString = puzzlesAndSolutions[0][0].split("");

    let board = [];

    for (let i = 0; i < 9; i++) {
      board.push(puzzleString.slice(i * 9, i * 9 + 9));
    }

    assert.equal(solver.checkRegionPlacement(board, 0, 0, 5), false);
  });

  test("Valid puzzle strings pass the solver", function () {
    let puzzle = puzzlesAndSolutions[0][0];
    let solution = puzzlesAndSolutions[0][1];

    assert.equal(solver.solve(puzzle).flat().join(""), solution);
  });

  test("Invalid puzzle strings fail the solver", function () {
    let puzzle = puzzlesAndSolutions[0][0].replace("1", "A");
    assert.equal(solver.solve(puzzle), false);
  });

  test("Solver returns the expected solution for an incomplete puzzle", function () {
    let puzzle = puzzlesAndSolutions[0][0];
    let solution = puzzlesAndSolutions[0][1];
    assert.equal(solver.solve(puzzle).flat().join(""), solution);
  });
});
