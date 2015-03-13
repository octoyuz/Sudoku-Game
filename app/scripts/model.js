var Cell = require('./Cell');

var seedGrid = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 3, 4, 5, 6, 7, 8, 9, 1],
  [5, 6, 7, 8, 9, 1, 2, 3, 4],
  [8, 9, 1, 2, 3, 4, 5, 6, 7],
  [3, 4, 5, 6, 7, 8, 9, 1, 2],
  [6, 7, 8, 9, 1, 2, 3, 4, 5],
  [9, 1, 2, 3, 4, 5, 6, 7, 8]
];

var gameGrid = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 3, 4, 5, 6, 7, 8, 9, 1],
  [5, 6, 7, 8, 9, 1, 2, 3, 4],
  [8, 9, 1, 2, 3, 4, 5, 6, 7],
  [3, 4, 5, 6, 7, 8, 9, 1, 2],
  [6, 7, 8, 9, 1, 2, 3, 4, 5],
  [9, 1, 2, 3, 4, 5, 6, 7, 8]
];

var cells;

function shuffleGrid (grid) {
  var i, j, k, temp, col, col1, col2,
  row1, row2, sub, sub1, sub2, num1, num2;

  //swap the same columns of each subsquare
  for(i = 0; i < 25; i++) {
    col = Math.floor(Math.random()*3);
    sub1 = Math.floor(Math.random()*3);
    sub2 = Math.floor(Math.random()*3);
    for(j = 0; j < grid.length; j++) {
      temp = grid[j][col + sub1*3];
      grid[j][col + sub1*3] = grid[j][col + sub2*3];
      grid[j][col + sub2*3] = temp;
    }
  }

  //swap all columns within each subsquare
  for(i = 0; i < 25; i++) {
    sub = Math.floor(Math.random()*3);
    col1 = Math.floor(Math.random()*3);
    col2 = Math.floor(Math.random()*3);
    while(col1 == col2) col2 = Math.floor(Math.random()*3);
    for(j = 0; j < grid.length; j++) {
      temp = grid[j][sub*3 + col1];
      grid[j][sub*3 + col1] = grid[j][sub*3 + col2];
      grid[j][sub*3 + col2] = temp;
    }
  }

  //swap all rows within each subsquare
  for(i = 0; i < 25; i++) {
    sub = Math.floor(Math.random()*3);
    row1 = Math.floor(Math.random()*3);
    row2 = Math.floor(Math.random()*3);
    while(row1 == row2) row2 = Math.floor(Math.random()*3);
    for(j = 0; j < grid.length; j++) {
      temp = grid[sub*3 + row1][j];
      grid[sub*3 + row1][j] = grid[sub*3 + row2][j];
      grid[sub*3 + row2][j] = temp;
    }
  }

  //swap one number with another
  for(i = 0; i < 25; i++) {
    num1 = Math.floor(Math.random()*9 + 1);
    num2 = Math.floor(Math.random()*9 + 1);
    while(num1 == num2) num2 = Math.floor(Math.random()*9 + 1);
    for(j = 0; j < grid.length; j++) {
      for(k = 0; k < grid[j].length; k++) {
        if(grid[j][k] == num1)
          grid[j][k] = num2;
        else if(grid[j][k] == num2)
          grid[j][k] = num1;
      }
    }
  }

  return grid;
}

function fillFixedCells (cells, difficulty) {
  var index;
  difficulty *= 15;
  while (difficulty > 0) {
    index = Math.floor(Math.random() * 81);
    cells[Math.floor(index/9)][Math.floor(index%9)].setToEmptyCell();
    difficulty--;
  }
}

function destroyCells () {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      cells[i][j].destroy();
    }
  }
}

function resetCells () {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (cells[i][j].shouldBeReset()) {
        cells[i][j].setValue(0);
      }
    }
  }
}

function isValidFill (x, y, value) {
  var copy = cells[x][y],
    set = {},
    i,
    j,
    subX,
    subY;

  var check = function (value) {
    if (value == 0) {
      return true;
    }
    if (set[value]) {
      cells[x][y].val = copy;
      return false;
    }
    set[value] = true;
    return true;
  };

  cells[x][y].val = value;
  for (i = 0; i < 9; i++) {
    if(!check(cells[i][y].val)) {
      return false;
    }
  }

  set = {};
  for (i = 0; i < 9; i++) {
    if(!check(cells[x][i].val)) {
      return false;
    }
  }

  set = {};
  subX = Math.floor(x/3)*3;
  subY = Math.floor(y/3)*3;
  for (i = subX; i < subX + 3; i++) {
    for (j = subY; j < subY + 3; j++) {
      if(!check(cells[i][j].val)) {
        return false;
      }
    }
  }
  cells[x][y].val = copy;
  return true;
}

function copyGrid () {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      gameGrid[i][j] = seedGrid[i][j];
    }
  }
  return gameGrid;
}

function createCells (game, difficulty) {
  var grid = copyGrid();
  grid = shuffleGrid(grid);

  cells = [];
  for (var i = 0; i < 9; i++) {
    var columns = [];
    for (var j = 0; j < 9; j++) {
      columns[j] = new Cell({
        x: i,
        y: j
      }, game);
      columns[j].setToFixedCell(grid[i][j]);
    }
    cells[i] = columns;
  }

  fillFixedCells(cells, difficulty);
  return cells;
}

module.exports = {
  createCells: createCells,
  resetCells: resetCells,
  destroyCells: destroyCells,
  isValidFill: isValidFill
};