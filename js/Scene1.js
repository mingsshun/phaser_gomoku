class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }
  preload() {
    this.load.html('nameForm', 'html/loginForm.html');
  }
  create() {
    this.add.text(20, 20, "Loading game...");
    // this.scene.start("playGame");
    
    let element = this.add.dom(this.sys.canvas.width / 2, this.sys.canvas.height / 2).createFromCache('nameForm');
    element.addListener('click');
    element.on('click', function (event) {

      if (event.target.name === 'startButton') {
        let inputUsername_1 = this.getChildByName('username_1');
        let inputUsername_2 = this.getChildByName('username_2');

        //  Have they entered anything?
        if (inputUsername_1.value !== '' && inputUsername_2.value !== '' && inputUsername_1.value !== inputUsername_2.value) {
          //  Turn off the click events
          this.removeListener('click');

          window.username_1 = inputUsername_1.value;
          window.username_2 = inputUsername_2.value;

          this.scene.scene.start("playGame");
        }
      }

    });
  }
}
