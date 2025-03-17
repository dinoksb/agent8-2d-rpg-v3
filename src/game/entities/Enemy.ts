import Phaser from "phaser";
import { Unit } from "./Unit";
import { Player } from "./Player";

export class Enemy extends Unit {
  // Stats
  public health: number = 50;
  public maxHealth: number = 50;
  public attackDamage: number = 10;
  
  // State
  private aggroRange: number = 200;
  private attackRange: number = 20;
  private lastAttackTime: number = 0;
  private attackCooldown: number = 1000; // 1 second
  private healthBar: Phaser.GameObjects.Graphics;
  private healthBarOffsetY: number = -35; // Offset to position above enemy's head

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, 'enemy', `enemy-${Date.now()}-${Math.floor(Math.random() * 1000)}`, x, y);
    
    // Set up physics body
    this.setBodySize(20, 30);
    this.setOffset(6, 10);
    this.setMoveSpeed(80);
    
    // Create health bar
    this.healthBar = scene.add.graphics();
    this.updateHealthBar();
    
    // Set depth for rendering order
    this.setDepth(5);
    this.healthBar.setDepth(6);
    
    // Store reference to this entity on the game object for easy access
    this.self.setData('entity', this);
  }

  update() {
    // Update health bar position
    this.updateHealthBar();
  }

  public followPlayer(player: Player) {
    // Calculate distance to player
    const distance = Phaser.Math.Distance.Between(
      this.x, 
      this.y, 
      player.x, 
      player.y
    );
    
    // Follow player if within aggro range
    if (distance < this.aggroRange) {
      // Move towards player
      if (distance > this.attackRange) {
        const angle = Phaser.Math.Angle.Between(
          this.x, 
          this.y, 
          player.x, 
          player.y
        );
        
        const velocityX = Math.cos(angle) * this.moveSpeed;
        const velocityY = Math.sin(angle) * this.moveSpeed;
        
        this.setVelocity(velocityX, velocityY);
      } else {
        // Stop when in attack range
        this.setVelocity(0, 0);
        
        // Attack if cooldown is over
        const time = this.self.scene.time.now;
        if (time > this.lastAttackTime + this.attackCooldown) {
          this.attack(player);
          this.lastAttackTime = time;
        }
      }
    } else {
      // Stop when player is out of range
      this.setVelocity(0, 0);
    }
  }

  private attack(player: Player) {
    const scene = this.self.scene;
    
    // Create attack effect
    const attackEffect = scene.add.sprite(this.x, this.y, 'hit-effect');
    attackEffect.setAlpha(0.5);
    attackEffect.setDepth(4);
    
    // Animate attack effect
    scene.tweens.add({
      targets: attackEffect,
      alpha: 0,
      scale: 1.2,
      duration: 200,
      onComplete: () => {
        attackEffect.destroy();
      }
    });
  }

  public takeDamage(amount: number) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
    
    const scene = this.self.scene;
    
    // Create hit effect
    const hitEffect = scene.add.sprite(this.x, this.y, 'hit-effect');
    hitEffect.setAlpha(0.7);
    hitEffect.setDepth(9);
    
    // Animate hit effect
    scene.tweens.add({
      targets: hitEffect,
      alpha: 0,
      scale: 1.5,
      duration: 300,
      onComplete: () => {
        hitEffect.destroy();
      }
    });
    
    // Flash enemy when hit
    scene.tweens.add({
      targets: this.self,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 1
    });
    
    // Update health bar
    this.updateHealthBar();
    
    // Knockback
    if (scene.registry.get('player')) {
      const player = scene.registry.get('player');
      const angle = Phaser.Math.Angle.Between(player.x, player.y, this.x, this.y);
      this.setVelocity(
        Math.cos(angle) * 150,
        Math.sin(angle) * 150
      );
      
      // Stop knockback after a short time
      scene.time.delayedCall(100, () => {
        if (this.self.active) {
          this.setVelocity(0, 0);
        }
      });
    }
  }

  private updateHealthBar() {
    this.healthBar.clear();
    
    // Only show health bar if enemy has taken damage
    if (this.health < this.maxHealth) {
      const barWidth = 30;
      const barHeight = 5;
      const barX = this.x - barWidth / 2;
      const barY = this.y + this.healthBarOffsetY;
      
      // Background
      this.healthBar.fillStyle(0x000000, 0.5);
      this.healthBar.fillRect(barX, barY, barWidth, barHeight);
      
      // Health fill
      const healthPercentage = this.health / this.maxHealth;
      this.healthBar.fillStyle(0xff0000, 1);
      this.healthBar.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
    }
  }

  destroy() {
    // Clean up health bar when enemy is destroyed
    if (this.healthBar) {
      this.healthBar.destroy();
    }
    
    super.destroy();
  }
}
