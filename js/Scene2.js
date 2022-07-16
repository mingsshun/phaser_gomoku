var BOARD_COLS;
var BOARD_ROWS;
var TILE_SIZE = 40;

class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
    this.listOfRects = [];
    this.listOfMarkers = [];
  }

  create() {
    this.add.text(20, 20, "Playing game", { font: "25px Arial", fill: "yellow" });

    this.markerGroup = this.add.group();
    this.spawnBoard();

    console.log(this.sys.canvas.width, this.sys.canvas.height)
  }

  update() {
  }

  spawnBoard() {
    BOARD_COLS = Math.floor(this.sys.canvas.width / TILE_SIZE);
    BOARD_ROWS = Math.floor(this.sys.canvas.height / TILE_SIZE);

    for (let i = 0; i < BOARD_COLS; i++) {
      let rects = [];
      // let rects = [];
      for (let j = 0; j < BOARD_ROWS; j++) {
        let position = { x: i * TILE_SIZE + TILE_SIZE / 2, y: j * TILE_SIZE + TILE_SIZE / 2 };

        let rect = this.add.rectangle(position.x, position.y, TILE_SIZE, TILE_SIZE);
        rect.setStrokeStyle(2, 0x1a65ac);

        rect.setInteractive().on('pointerup', (pointer, localX, localY, event) => {
          if (!rect.isMarked) {
            rect.isMarked = 'X';

            let text = this.add.text(position.x, position.y, "X", { font: "25px Arial", fill: "yellow" });
            text.x -= text.width / 2;
            text.y -= text.height / 2;
            this.markerGroup.add(text);

            console.log(i, j)
          }

        });

        rects.push(rect);
      }
      this.listOfRects.push(rects);
    }
  }
}
