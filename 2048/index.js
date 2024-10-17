var score = 0;
var row = 4;
var col = 4;
var board;
var range = [2];
var checkpoint = 0;
var havemoves = false;
window.onload = function () {
  setgame();
};

let updatetile = (tile, num) => {
  tile.innerText = "";
  tile.classList.value = "";
  tile.classList.add("tile");
  if (num >= 0) {
    tile.innerText = num;
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
};

const changerange = () => {
  if (checkpoint % 200 !== 0) {
    range.push(range[range.length - 1] * 2);
  }
  if (checkpoint % 200 === 0) {
    range.shift();
  }
};

const GenrateNum = () => {
  checkpoint = Math.max(score, checkpoint);
  if (score % 100 === 0 && score > 0) {
    changerange();
    checkpoint = Math.max(score, checkpoint);
  }
  const randomIndex = Math.floor(Math.random() * range.length);
  return range[randomIndex];
};

const hasplacetoenternumber = () => {
  const emptyspaces = [];

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (board[i][j] == 0) {
        emptyspaces.push([i, j]);
      }
    }
  }

  if (score % 100 === 0 && score > 0) {
    changerange();
  }

  if (emptyspaces.length > 0) {
    havemoves = true;
    const varpos = Math.floor(Math.random() * emptyspaces.length);
    let [r, c] = emptyspaces[varpos];
    board[r][c] = GenrateNum();
    let tile = document.getElementById(`${r}-${c}`);
    updatetile(tile, board[r][c]);
  } else {
    havemoves = false;
  }
};

function slide(row) {
  row = row.filter((num) => num != 0);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0; // Set the merged tile to 0
    }
  }
  row = row.filter((num) => num != 0); // Remove the zeroes created by merging
  while (row.length < col) {
    row.push(0);
  }
  return row;
}

function slideLeft() {
  for (let r = 0; r < row; r++) {
    let newRow = slide(board[r]);
    board[r] = newRow;
    for (let c = 0; c < col; c++) {
      let tile = document.getElementById(`${r}-${c}`);
      updatetile(tile, board[r][c]);
    }
  }
}

function slideRight() {
  for (let r = 0; r < row; r++) {
    board[r].reverse();
    let newRow = slide(board[r]);
    board[r] = newRow.reverse();
    for (let c = 0; c < col; c++) {
      let tile = document.getElementById(`${r}-${c}`);
      updatetile(tile, board[r][c]);
    }
  }
}

function slideUp() {
  for (let c = 0; c < col; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
    let newColumn = slide(column);
    for (let r = 0; r < row; r++) {
      board[r][c] = newColumn[r];
      let tile = document.getElementById(`${r}-${c}`);
      updatetile(tile, board[r][c]);
    }
  }
}

function slideDown() {
  for (let c = 0; c < col; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
    column.reverse();
    let newColumn = slide(column);
    newColumn.reverse();
    for (let r = 0; r < row; r++) {
      board[r][c] = newColumn[r];
      let tile = document.getElementById(`${r}-${c}`);
      updatetile(tile, board[r][c]);
    }
  }
}

// Event listener for key presses
document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowLeft") {
    slideLeft();
    hasplacetoenternumber();
  } else if (e.code == "ArrowRight") {
    slideRight();
    hasplacetoenternumber();
  } else if (e.code == "ArrowUp") {
    slideUp();
    hasplacetoenternumber();
  } else if (e.code == "ArrowDown") {
    slideDown();
    hasplacetoenternumber();
  }

  document.getElementById("score").innerText = score;

  // Check for game over or win
  checkGameOver();
});

function checkGameOver() {
  let hasEmptyTile = false;
  for (let r = 0; r < row; r++) {
    for (let c = 0; c < col; c++) {
      if (board[r][c] == 0) {
        hasEmptyTile = true;
        break;
      }
    }
  }

  if (!hasEmptyTile) {
    if (confirm("Game Over! No more moves left. Do you want to restart?")) {
      location.reload();
    }
  }
}

function setgame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < row; r++) {
    for (let c = 0; c < col; c++) {
      let tile = document.createElement("div");
      tile.id = `${r.toString()}-${c.toString()}`;
      let num = board[r][c];
      updatetile(tile, num);
      document.getElementById("board").append(tile);
    }
  }
  hasplacetoenternumber();
}
