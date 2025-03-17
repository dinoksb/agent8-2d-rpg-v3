import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    // Display loading message
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const loadingText = this.add.text(width / 2, height / 2, 'Starting Game...', {
      font: '24px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Add a simple animation to the loading text
    this.tweens.add({
      targets: loadingText,
      alpha: 0.5,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    // Start the game scene after a short delay
    this.time.delayedCall(1000, () => {
      this.scene.start("GameScene");
      this.scene.stop();
    });
  }
}
