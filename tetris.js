const gameWidth = 10;
const gameHeight = 17;
const squareSize = 40; // In pixels
const topRows = 2; // The number of rows that will be above the max height line
let fallInterval = 30; // Number of frames it takes to fall one square
const visibleFuturePieces = 3; // The number of upcoming pieces that the player can see
const moveInterval = 4; // Same as fallInterval, but for moving left and right

let board = [];
let upcomingPieces = [];
let currentPiece;
let fallTimer = 0;
let futurePieces = [];
let moveDir = 0; // -1 is left, 1 is right
let moveTimer = 0;
let gameOver = false;

function getRandomPiece() {
  let keys = Object.keys(shapeData);
  let rand = Math.random();
  let pData = shapeData[keys[keys.length * rand << 0]];
  return new Piece(pData.shape, pData.color, keys[keys.length * rand << 0]);
}

function showBoard() {
  background(35, 41, 37);

  // Draw all the pieces on the board
  noStroke();
  for (let r=0; r<gameHeight; r++) {
    for (let c=0; c<gameWidth; c++) {
      if (!board[r][c]) { continue; }
      // console.log(shapeData[board[r][c]].color);
      fill(shapeData[board[r][c]].color);
      square(c * squareSize, r * squareSize, squareSize);
    }
  }

  // Draw the max height line
  stroke("#728578");
  line(0, topRows * squareSize, gameWidth * squareSize, topRows * squareSize);

  // Draw current piece
  noStroke();
  fill(currentPiece.color);
  for (let r=0; r<4; r++) {
    for (let c=0; c<4; c++) {
      if (!currentPiece.shape[r][c]) { continue; }
      square((currentPiece.col + c) * squareSize, (currentPiece.row + r) * squareSize, squareSize);
    }
  }
}

function clearRows() {
  let newBoard = [];
  let rowsToClear = [];
  for (let r=0; r<gameHeight; r++) {
    for (let c=0; c<gameWidth; c++) {
      if (!board[r][c]) { break; }
      if (c == gameWidth - 1) {
        rowsToClear.push(r);
      }
    }
  }
  if (rowsToClear.length == 0) { return; }

  // console.log(rowsToClear);
  let blankRow = [];
  for (let c=0; c<gameWidth; c++) {
    blankRow.push("");
  }

  for (let r=0; r<gameHeight; r++) {
    if (rowsToClear.includes(r)) { continue; }
    newBoard.push(board[r]);
  }

  // Add blank rows at the top
  rowsToClear.forEach(i => {
    newBoard.unshift(blankRow);
  })
  board = newBoard;
};

function gameIsOver() {
  for (let c=0; c<gameWidth; c++) {
    if (board[topRows-1][c]) { return true; }
  }
}

function setUpGame() {
  board = [];
  for (let r=0; r<gameHeight; r++) {
    board.push([]);
    for (let c=0; c<gameWidth; c++) {
      board[r].push("");
    }
  }
  currentPiece = getRandomPiece();
  futurePieces = [];
  for (let i=0; i<visibleFuturePieces; i++) {
    futurePieces.push(getRandomPiece());
  }
  gameOver = false;
}

function setup() {
  createCanvas(gameWidth * squareSize, gameHeight * squareSize);
  setUpGame();
}

function draw() {
  if (gameOver) { return; }
  showBoard();

  fallTimer ++;
  if (fallTimer == fallInterval) {
    fallTimer = 0;
    if (currentPiece.canMoveDown()) {
      currentPiece.moveDown();
    }
    else {
      // Add the piece to the board matrix
      for (let r=0; r<4; r++) {
        for (let c=0; c<4; c++) {
          if (!currentPiece.shape[r][c]) { continue; }
          if (!board[currentPiece.row + r]) { continue; }
          board[currentPiece.row + r][currentPiece.col + c] = currentPiece.shapeName;
        }
      }
      if (gameIsOver()) {
        console.log("Game over");
        gameOver = true;
      }

      clearRows();

      currentPiece = futurePieces.shift();
      futurePieces.push(getRandomPiece());
    }
  }
  moveTimer++;
  if (moveTimer == moveInterval) {
    moveTimer = 0;
    if (currentPiece.canSideMove(moveDir)) {
      // console.log("can move");
      currentPiece.sideMove(moveDir);
    }
  }
}

// ur mom

function keyPressed() {
  if (gameOver) {
    if (keyCode == DOWN_ARROW || keyCode == UP_ARROW || keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
      // console.log("new game")
      setUpGame();
      return;
    }
  }
  if (keyCode == DOWN_ARROW) {
    fallTimer = 0;
    fallInterval = 4;
  }
  else if (keyCode == LEFT_ARROW) {
    moveTimer = 0;
    moveDir = -1;
  }
  else if (keyCode == RIGHT_ARROW) {
    moveTimer = 0;
    moveDir = 1;
  }
  else if (keyCode == UP_ARROW) {
    if (currentPiece.canRotate()) {
      currentPiece.rotate();
    }
  }
  else if (keyCode == 32) {
    console.log(board);
  }
}

function keyReleased() {
  if (keyCode == DOWN_ARROW) {
    fallInterval = 30;
  }
  else if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
    if (keyIsDown(LEFT_ARROW)) {
      moveDir = -1;
    }
    else if (keyIsDown(RIGHT_ARROW)) {
      moveDir = 1;
    }
    else {
      moveDir = 0;
    }
  }
}