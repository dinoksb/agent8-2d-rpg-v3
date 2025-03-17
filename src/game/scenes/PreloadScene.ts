import Phaser from "phaser";
import { generateProceduralTextures } from "../utils/generateProceduralTextures";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    // Try to load assets, but we'll create procedural textures as fallbacks
    this.load.image('player-down-1', 'assets/player/player-down-1.png');
    this.load.image('player-down-2', 'assets/player/player-down-2.png');
    this.load.image('player-up-1', 'assets/player/player-up-1.png');
    this.load.image('player-up-2', 'assets/player/player-up-2.png');
    this.load.image('player-left-1', 'assets/player/player-left-1.png');
    this.load.image('player-left-2', 'assets/player/player-left-2.png');
    this.load.image('player-right-1', 'assets/player/player-right-1.png');
    this.load.image('player-right-2', 'assets/player/player-right-2.png');
    
    this.load.image('enemy', 'assets/enemy/enemy.png');
    this.load.image('weapon', 'assets/items/weapon.png');
    this.load.image('attack-effect', 'assets/effects/attack-effect.png');
    this.load.image('hit-effect', 'assets/effects/hit-effect.png');
    this.load.image('pickup-effect', 'assets/effects/pickup-effect.png');
    this.load.image('drop-effect', 'assets/effects/drop-effect.png');
    this.load.image('item-glow', 'assets/effects/item-glow.png');
    
    this.load.image('grass-tile', 'assets/tiles/grass-tile.png');
    this.load.image('stone-tile', 'assets/tiles/stone-tile.png');
    this.load.image('wall-tile', 'assets/tiles/wall-tile.png');
    
    this.load.image('health-potion', 'assets/items/health-potion.png');
    this.load.image('mana-potion', 'assets/items/mana-potion.png');
    this.load.image('gold-coin', 'assets/items/gold-coin.png');
    this.load.image('armor', 'assets/items/armor.png');
    this.load.image('item-default', 'assets/items/item-default.png');
    this.load.image('item-placeholder', 'assets/items/item-placeholder.png');
    
    // Add loading event to handle missing assets
    this.load.on('loaderror', (fileObj) => {
      console.log(`Error loading asset: ${fileObj.key}`);
    });
    
    // Create loading progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        color: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        color: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', (value) => {
      percentText.setText(parseInt((value * 100).toString()) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });
  }

  create() {
    // Create procedural textures for all missing assets
    this.createProceduralTextures();
    
    // Call the utility function for additional effects
    generateProceduralTextures(this);
    
    // Start the boot scene
    this.scene.start("BootScene");
  }

  private createProceduralTextures() {
    // Create procedural textures for missing assets
    this.createPlayerTextures();
    this.createEnemyTextures();
    this.createTileTextures();
    this.createEffectTextures();
    this.createItemTextures();
  }

  private createPlayerTextures() {
    // Create player textures if not loaded
    const textureKeys = [
      'player-down-1', 'player-down-2',
      'player-up-1', 'player-up-2',
      'player-left-1', 'player-left-2',
      'player-right-1', 'player-right-2'
    ];
    
    textureKeys.forEach(key => {
      if (!this.textures.exists(key)) {
        const canvas = this.textures.createCanvas(key, 32, 32);
        const ctx = canvas.getContext();
        
        // Fill background with transparent color
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, 32, 32);
        
        // Draw player body
        ctx.fillStyle = '#3498db'; // Blue
        ctx.fillRect(8, 8, 16, 16);
        
        // Draw player head
        ctx.fillStyle = '#f1c40f'; // Yellow
        ctx.fillRect(10, 4, 12, 8);
        
        // Add direction indicator
        if (key.includes('down')) {
          ctx.fillStyle = '#e74c3c'; // Red
          ctx.fillRect(14, 24, 4, 4);
        } else if (key.includes('up')) {
          ctx.fillStyle = '#e74c3c'; // Red
          ctx.fillRect(14, 4, 4, 4);
        } else if (key.includes('left')) {
          ctx.fillStyle = '#e74c3c'; // Red
          ctx.fillRect(4, 14, 4, 4);
        } else if (key.includes('right')) {
          ctx.fillStyle = '#e74c3c'; // Red
          ctx.fillRect(24, 14, 4, 4);
        }
        
        // Add animation frame indicator
        if (key.includes('-2')) {
          ctx.fillStyle = '#2ecc71'; // Green
          ctx.fillRect(24, 24, 4, 4);
        }
        
        // Add outline
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        ctx.strokeRect(8, 8, 16, 16);
        ctx.strokeRect(10, 4, 12, 8);
        
        canvas.refresh();
      }
    });
  }

  private createEnemyTextures() {
    // Create enemy texture if not loaded
    if (!this.textures.exists('enemy')) {
      const canvas = this.textures.createCanvas('enemy', 32, 32);
      const ctx = canvas.getContext();
      
      // Fill background with transparent color
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, 32, 32);
      
      // Draw enemy body
      ctx.fillStyle = '#e74c3c'; // Red
      ctx.fillRect(8, 8, 16, 16);
      
      // Draw enemy head
      ctx.fillStyle = '#7f8c8d'; // Gray
      ctx.fillRect(10, 4, 12, 8);
      
      // Draw enemy eyes
      ctx.fillStyle = '#ffffff'; // White
      ctx.fillRect(12, 6, 3, 3);
      ctx.fillRect(17, 6, 3, 3);
      
      // Add outline
      ctx.strokeStyle = '#2c3e50';
      ctx.lineWidth = 1;
      ctx.strokeRect(8, 8, 16, 16);
      ctx.strokeRect(10, 4, 12, 8);
      
      canvas.refresh();
    }
  }

  private createTileTextures() {
    // Create tile textures if not loaded
    const tileKeys = ['grass-tile', 'stone-tile', 'wall-tile'];
    const tileColors = ['#2ecc71', '#7f8c8d', '#34495e']; // Green, Gray, Dark Gray
    
    tileKeys.forEach((key, index) => {
      if (!this.textures.exists(key)) {
        const canvas = this.textures.createCanvas(key, 32, 32);
        const ctx = canvas.getContext();
        
        // Fill tile with color
        ctx.fillStyle = tileColors[index];
        ctx.fillRect(0, 0, 32, 32);
        
        // Add texture pattern
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if ((i + j) % 2 === 0) {
              ctx.fillRect(i * 8, j * 8, 8, 8);
            }
          }
        }
        
        // Add border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, 32, 32);
        
        canvas.refresh();
      }
    });
  }

  private createEffectTextures() {
    // Create effect textures if not loaded
    const effectKeys = ['attack-effect', 'hit-effect', 'pickup-effect', 'drop-effect', 'item-glow'];
    const effectColors = ['#f39c12', '#e74c3c', '#2ecc71', '#3498db', '#f1c40f']; // Orange, Red, Green, Blue, Yellow
    
    effectKeys.forEach((key, index) => {
      if (!this.textures.exists(key)) {
        const canvas = this.textures.createCanvas(key, 32, 32);
        const ctx = canvas.getContext();
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, effectColors[index]);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        
        canvas.refresh();
      }
    });
  }

  private createItemTextures() {
    // Create item textures if not loaded
    const itemKeys = [
      'health-potion', 'mana-potion', 'gold-coin', 
      'weapon', 'armor', 'item-default', 'item-placeholder'
    ];
    
    const itemColors = [
      '#e74c3c', // Red (health potion)
      '#3498db', // Blue (mana potion)
      '#f1c40f', // Yellow (gold coin)
      '#e67e22', // Orange (weapon)
      '#2ecc71', // Green (armor)
      '#9b59b6', // Purple (item default)
      '#95a5a6'  // Light gray (placeholder)
    ];
    
    itemKeys.forEach((key, index) => {
      if (!this.textures.exists(key)) {
        const canvas = this.textures.createCanvas(key, 32, 32);
        const ctx = canvas.getContext();
        
        // Fill background with transparent color
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, 32, 32);
        
        // Draw different shapes based on item type
        ctx.fillStyle = itemColors[index];
        
        if (key === 'health-potion' || key === 'mana-potion') {
          // Draw potion bottle
          ctx.fillRect(12, 8, 8, 16);
          ctx.fillRect(10, 18, 12, 6);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(14, 10, 4, 4);
        } else if (key === 'gold-coin') {
          // Draw coin
          ctx.beginPath();
          ctx.arc(16, 16, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(16, 16, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (key === 'weapon') {
          // Draw sword
          ctx.fillRect(14, 8, 4, 20);
          ctx.fillRect(10, 12, 12, 4);
        } else if (key === 'armor') {
          // Draw armor
          ctx.fillRect(10, 8, 12, 16);
          ctx.fillRect(8, 12, 16, 8);
        } else {
          // Draw generic item
          ctx.fillRect(8, 8, 16, 16);
        }
        
        // Add border
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        ctx.strokeRect(8, 8, 16, 16);
        
        canvas.refresh();
      }
    });
  }
}
