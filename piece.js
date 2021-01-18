class Piece {
  constructor(shape, color, shapeName) {
    this.shape = shape;
    this.color = color;
    this.shapeName = shapeName;

    // Represents position of top left of shape matrix
    this.row = -2;
    this.col = 3;
  }

  moveDown() {
    this.row += 1;
  }

  canMoveDown() {
    // Check if it is above the ground
    let lowestRow;
    for (let r=3; r>-1; r--) {
      for (let c=0; c<4; c++) {
        if (this.shape[r][c]) {
          lowestRow = r;
          break;
        }
      }
      if (lowestRow) { break; }
    }
    if (this.row + lowestRow + 2 > gameHeight) {
      return false;
    }

    // Check for collisions with other pieces
    for (let r=0; r<4; r++) {
      for (let c=0; c<4; c++) {
        if (!this.shape[r][c]) { continue; }
        if (this.row + r < 0) { continue; }
        if (board[this.row + r + 1][this.col + c]) {
          return false;
        }
      }
    }

    return true;
  }

  sideMove(dir) {
    this.col += dir;
  }

  canSideMove(dir) {
    let farthestCol;
    for (let r=0; r<4; r++) {
      for (let c=0; c<4; c++) {
        if (!this.shape[r][c]) { continue; }
        if (this.col + c + dir < 0 || this.col + c + dir + 1 > gameWidth) {
          return false;
        }
      }
    }
    
    if (dir == 0) { return false; }
    for (let r=0; r<4; r++) {
      for (let c=0; c<4; c++) {
        if (!this.shape[r][c]) { continue; }
        if (!board[this.row + r]) { continue; }
        if (board[this.row + r][this.col + c + dir]) {
          return false;
        }
      }
    }

    return true;
  }

  rotate() {
    let result = [];
    for (let c=0; c<4; c++) {
      result.push([]);
      for (let r=3; r>-1; r--) {
        result[result.length-1].push(this.shape[r][c])
      }
    }
    this.shape = result;
  }

  canRotate() {
    // return true;

    // A lot of copy and pasted code I know
    let result = [];
    for (let c=0; c<4; c++) {
      result.push([]);
      for (let r=3; r>-1; r--) {
        result[result.length-1].push(this.shape[r][c])
      }
    }

    // Check if the rotated shape overlaps with anything
    for (let r=0; r<4; r++) {
      for (let c=0; c<4; c++) {
        if (!result[r][c]) { continue; }
        if (!board[this.row + r]) { continue; }
        if (this.row + r < 0) { continue; }
        if (board[this.row + r][this.col + c]) {
          return false;
        }
      }
    }

    return true;
  }
}