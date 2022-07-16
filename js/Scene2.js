var BOARD_COLS;
var BOARD_ROWS;
var TILE_SIZE = 40;
var GAME_DEFINE = {
  COLOR_1: 'yellow',
  COLOR_2: 'red',
  MARKER_1: 'X',
  MARKER_2: 'O'
}
var ADJACENT_DIRECTION_ROW = [
  { x: 1, y: 0 },
  { x: -1, y: 0 }
];
var ADJACENT_DIRECTION_COL = [
  { x: 0, y: 1 },
  { x: 0, y: -1 }
];
var ADJACENT_DIRECTION_CROSS_1 = [
  { x: 1, y: 1 },
  { x: -1, y: -1 }
];
var ADJACENT_DIRECTION_CROSS_2 = [
  { x: -1, y: -1 },
  { x: 1, y: 1 }
];

class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
    this.listOfRects = [];
    this.listOfMarkers = [];
  }

  create() {
    this.markerGroup = this.add.group();
    this.spawnBoard();

    this.hlMarker = this.add.rectangle(200, 200, TILE_SIZE, TILE_SIZE, 0x2772C4);
    this.hlMarker.setVisible(false)

    this.user_1 = this.add.text(20, 20, "User 1: " + window.username_1, { font: "25px Arial", fill: GAME_DEFINE.COLOR_1 });
    this.user_2 = this.add.text(20, 20, "User 2: " + window.username_2, { font: "25px Arial", fill: GAME_DEFINE.COLOR_2 });
    this.user_2.x = this.sys.canvas.width - this.user_2.width - 20;

    this.isUser1Turn = true;
    this.isEndGame = false;

    // console.log(this.sys.canvas.width, this.sys.canvas.height)
  }

  update() {
  }

  spawnBoard() {
    BOARD_COLS = Math.floor(this.sys.canvas.width / TILE_SIZE);
    BOARD_ROWS = Math.floor(this.sys.canvas.height / TILE_SIZE);

    for (let i = 0; i < BOARD_ROWS; i++) {
      let rects = [];
      // let rects = [];
      for (let j = 0; j < BOARD_COLS; j++) {
        let position = { x: i * TILE_SIZE + TILE_SIZE / 2, y: j * TILE_SIZE + TILE_SIZE / 2 };

        let rect = this.add.rectangle(position.x, position.y, TILE_SIZE, TILE_SIZE);
        rect.setStrokeStyle(2, 0x1a65ac);

        rect.setInteractive().on('pointerup', (pointer, localX, localY, event) => {
          if(this.isEndGame) return;
          if (!rect.isMarked) {
            let curMarker = this.isUser1Turn ? GAME_DEFINE.MARKER_1 : GAME_DEFINE.MARKER_2;
            rect.isMarked = {
              type: curMarker,
              row: j,
              col: i
            };

            let text = this.add.text(
              position.x,
              position.y,
              curMarker,
              { font: "25px Arial", fill: this.isUser1Turn ? GAME_DEFINE.COLOR_1 : GAME_DEFINE.COLOR_2 }
            );
            text.x -= text.width / 2;
            text.y -= text.height / 2;
            this.markerGroup.add(text);

            this.hlMarker.setVisible(true);
            this.hlMarker.setPosition(position.x, position.y);

            this.isUser1Turn = !this.isUser1Turn;

            this.detectWinStatus(curMarker, i, j);

            // console.log(i, j)
          }

        });

        rects.push(rect);
      }
      this.listOfRects.push(rects);
    }
  }

  detectWinStatus(type, row, col) {
    let rowResult = [];
    for (let dir of ADJACENT_DIRECTION_ROW) {
      this.getMatchesAdjacent(row, col, rowResult, dir, type);
    }
    let colResult = [];
    for (let dir of ADJACENT_DIRECTION_COL) {
      this.getMatchesAdjacent(row, col, colResult, dir, type);
    }
    let croResult_1 = [];
    for (let dir of ADJACENT_DIRECTION_CROSS_1) {
      this.getMatchesAdjacent(row, col, croResult_1, dir, type);
    }
    let croResult_2 = [];
    for (let dir of ADJACENT_DIRECTION_CROSS_2) {
      this.getMatchesAdjacent(row, col, croResult_2, dir, type);
    }
    if (rowResult.length >= 5) {
      this.isEndGame = true;
      console.log(rowResult);
    }
    else if (colResult.length >= 5) { this.isEndGame = true;
      console.log(colResult);
    }
    else if (croResult_1.length >= 5) { this.isEndGame = true;
      console.log(croResult_1);
    }
    else if (croResult_2.length >= 5) { this.isEndGame = true;
      console.log(croResult_2);
    }
  }

  getMatchesAdjacent(row, col, result, direction, type) {
    if (!(result[0] && result[0].row == row && result[0].col == col)) {
      result.push({ row: row, col: col });
    }

    let newRow = row + direction.x;
    let newCol = col + direction.y;
    if (this.listOfRects[newRow] !== undefined && this.listOfRects[newRow][newCol] !== undefined &&
      this.listOfRects[newRow][newCol].isMarked &&
      this.listOfRects[newRow][newCol].isMarked.type == type
    )
      this.getMatchesAdjacent(newRow, newCol, result, direction, type);
    else
      return;
  }
}
