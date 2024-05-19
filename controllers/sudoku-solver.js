class SudokuSolver {
  validate(puzzle) {
    if (puzzle.length != 81) {
      return false;
    }

    //Check if string contains anything other than 1-9 or .
    if (!/^[1-9.]*$/.test(puzzle)) {
      return false;
    }

    return true;
  }

  checkRowPlacement(puzzle, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzle[row][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzle, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzle[i][column] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzle, row, column, value) {
    let boxStartRow = row - (row % 3);
    let boxStartCol = column - (column % 3);

    for (let i = boxStartRow; i < boxStartRow + 3; i++) {
      for (let j = boxStartCol; j < boxStartCol + 3; j++) {
        if (puzzle[i][j] == value) {
          return false;
        }
      }
    }

    return true;
  }

  solve(puzzleString) {
    console.log(puzzleString);
    if (!this.validate(puzzleString)) {
      return false;
    }

    let puzzle = puzzleString.split("");
    let array = [];

    for (let i = 0; i < 9; i++) {
      array.push(puzzle.slice(i * 9, i * 9 + 9));
    }

    if (this.solveSudoku(array, 0, 0)) {
      return array;
    }
    return false;
  }

  solveSudoku(board, row, col) {
    //Base case
    if (row == 9 - 1 && col == 9) {
      return true;
    }

    //Move to the next row if the column is 9
    if (col == 9) {
      row++;
      col = 0;
    }
    //Skip the cell if it is not empty
    if (board[row][col] != ".") {
      //Move to the next column
      return this.solveSudoku(board, row, col + 1);
    }

    //Try placing a number in the cell
    for (let num = 1; num <= 9; num++) {
      if (this.isSafe(board, row, col, num)) {
        board[row][col] = `${num}`;

        if (this.solveSudoku(board, row, col + 1)) {
          return true;
        }
      }
      //Backtrack
      board[row][col] = ".";
    }
    return false;
  }

  isSafe(board, row, col, num) {
    return (
      this.checkRowPlacement(board, row, col, num) &&
      this.checkColPlacement(board, row, col, num) &&
      this.checkRegionPlacement(board, row, col, num)
    );
  }

  findConflicts(puzzleString, row, col, value) {
    let conflict = [];
    let puzzle = puzzleString.split("");
    let board = [];

    for (let i = 0; i < 9; i++) {
      board.push(puzzle.slice(i * 9, i * 9 + 9));
    }

    if (!this.checkColPlacement(board, row, col, value)) {
      conflict.push("column");
    }

    if (!this.checkRowPlacement(board, row, col, value)) {
      conflict.push("row");
    }

    if (!this.checkRegionPlacement(board, row, col, value)) {
      conflict.push("region");
    }

    return conflict;
  }
}

module.exports = SudokuSolver;
