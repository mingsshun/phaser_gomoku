window.onload = function(){
    var config = {
        type: Phaser.AUTO,
        width: 750,
        height: 1334,
        backgroundColor: 0x000000,  
        scale: {
            // Fit to window
            mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH ,
            // Center vertically and horizontally
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        // physics: {
        //     default: 'arcade',
        //     arcade: {
        //         gravity: { y: 200 }
        //     }
        // },
        parent: bodyId,
        dom: {
            createContainer: true
        },
        scene: [Scene1, Scene2]
    };

    var game = new Phaser.Game(config);
}