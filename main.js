window.onload = function(){
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: 0x000000,  
        // physics: {
        //     default: 'arcade',
        //     arcade: {
        //         gravity: { y: 200 }
        //     }
        // },
        scene: [Scene1, Scene2]
    };

    var game = new Phaser.Game(config);
}