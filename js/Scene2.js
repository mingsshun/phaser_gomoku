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
  { x: -1, y: 1 },
  { x: 1, y: -1 }
];
var STATE = {
  IN_GAME: 0,
  END_GAME: 1,
}

class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
    this.listOfRects = [];
    this.listOfMarkers = [];
  }

  create() {
    this.markerGroup = this.add.group();
    this.rectGroup = this.add.group();
    this.wallGroup = this.add.group();
    this.highlightGroup = this.add.group();
    this.spawnBoard();

    this.hlMarker = this.add.rectangle(200, 200, TILE_SIZE, TILE_SIZE, 0x2772C4);
    this.hlMarker.setVisible(false)
    this.tweens.add({
      targets: this.hlMarker,
      alpha: 0,
      ease: 'Power2',
      duration: 1000,
      // delay: i * 50,
      repeat: -1,
    })

    this.user_1 = this.add.text(20, 20, "User 1: " + window.username_1, { font: "25px Arial", fill: GAME_DEFINE.COLOR_1 });
    this.user_2 = this.add.text(20, 20, "User 2: " + window.username_2, { font: "25px Arial", fill: GAME_DEFINE.COLOR_2 });
    this.user_2.x = this.sys.canvas.width - this.user_2.width - 20;

    this.bgEndgame = this.add.rectangle(0, 0, this.sys.canvas.width, this.sys.canvas.height, 0x0072C4);
    this.bgEndgame.x = this.sys.canvas.width / 2;
    this.bgEndgame.y = this.sys.canvas.height / 2;
    this.textReplay = this.add.text(20, 20, "REPLAY", { font: "50px Arial", fill: '#ff0000' });
    this.textReplay.setPosition(this.bgEndgame.x - this.textReplay.width / 2, this.bgEndgame.y - this.textReplay.height / 2);
    this.textWinner = this.add.text(20, 20, '', { font: "50px Arial", fill: '#ffff00' });

    this.showPopupEndGame(false);

    this.isUser1Turn = true;
    this.isEndGame = false;

    this.state = STATE.IN_GAME;

    // console.log(this.sys.canvas.width, this.sys.canvas.height)
  }

  reset() {
    this.hlMarker.setVisible(false)
    for (let rect of this.rectGroup.getChildren()) {
      rect.isMarked = undefined;
      // rect.setVisible(false)
    }

    this.isUser1Turn = true;
    this.isEndGame = false;

    this.state = STATE.IN_GAME;
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
          if (this.isEndGame) return;
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

            this.createWall();

            this.detectWinStatus(curMarker, i, j);

            console.log(i, j)
          }

        });

        rects.push(rect);
        this.rectGroup.add(rect);
      }
      this.listOfRects.push(rects);
    }
  }

  createWall() {
    let ranRow, ranCol;

    do {
      ranRow = Phaser.Math.Between(0, BOARD_ROWS - 1);
      ranCol = Phaser.Math.Between(0, BOARD_COLS - 1);
    } while (this.listOfRects[ranRow][ranCol].isMarked)
    console.log('')
    console.log(ranRow, ranCol);
    this.listOfRects[ranRow][ranCol].isMarked = true;
    let wallRect = this.add.rectangle(ranRow * TILE_SIZE + TILE_SIZE / 2, ranCol * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE, 0x9966ff);
    this.wallGroup.add(wallRect);
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
    if (rowResult.length >= 5 || colResult.length >= 5 || croResult_1.length >= 5 || croResult_2.length >= 5) {
      let result = [{ row: row, col: col }];
      if (rowResult.length >= 5) {
        rowResult.shift()
        result = result.concat(rowResult);
      }
      if (colResult.length >= 5) {
        colResult.shift()
        result = result.concat(colResult);
      }
      if (croResult_1.length >= 5) {
        croResult_1.shift()
        result = result.concat(croResult_1);
      }
      if (croResult_2.length >= 5) {
        croResult_2.shift()
        result = result.concat(croResult_2);
      }
      this.isEndGame = true;

      for(let e of result){
        let hlRect = this.add.rectangle(e.row * TILE_SIZE + TILE_SIZE / 2, e.col * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE, 0xff0000);
        this.highlightGroup.add(hlRect);

        this.tweens.add({
          targets: hlRect,
          scale: 0,
          ease: 'Power2',
          duration: 300,
          // delay: i * 50,
          repeat: -1,
        })
      }

      this.endGame()
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

  showPopupEndGame(isShow = true) {
    this.bgEndgame.setVisible(isShow)
    this.textReplay.setVisible(isShow)
    this.textWinner.setVisible(isShow)
  }

  endGame() {
    this.state = STATE.END_GAME;
    setTimeout(_=>{
      this.markerGroup.clear(true);
      this.wallGroup.clear(true);
      this.highlightGroup.clear(true)
      this.textReplay.setInteractive().on('pointerup', _ => {
        this.showPopupEndGame(false);
        this.reset();
  
        this.textReplay.disableInteractive();
      })
      this.textWinner.text = this.isUser1Turn ? window.username_2 + " WON!!!" : window.username_1 + " WON!!!"
      this.textWinner.setPosition(this.bgEndgame.x - this.textWinner.width / 2, this.textReplay.y - 100);
  
      this.showPopupEndGame();
    }, 1500);
  }
}
