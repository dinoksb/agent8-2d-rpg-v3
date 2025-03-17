import Phaser from "phaser";
import { Unit } from "./Unit";
import { Item, ItemData, ItemType } from "./Item";
import { Inventory } from "../systems/Inventory";

export class Player extends Unit {
  // Stats
  public health: number = 100;
  public maxHealth: number = 100;
  public attackDamage: number = 20;
  public level: number = 1;
  public experience: number = 0;
  public experienceToNextLevel: number = 100;
  
  // State
  public isAttacking: boolean = false;
  public isInvulnerable: boolean = false;
  private invulnerabilityTime: number = 1000; // 1 second
  private invulnerabilityTimer: Phaser.Time.TimerEvent;
  private attackCooldown: number = 500; // 0.5 seconds
  private lastAttackTime: number = 0;
  
  // Weapon
  private weapon: Phaser.GameObjects.Sprite;
  
  // Inventory
  public inventory: Inventory;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, 'player', 'player', x, y);
    
    // Set up physics body
    this.setBodySize(20, 30);
    this.setOffset(6, 10);
    
    // Create weapon
    this.weapon = scene.add.sprite(x, y, 'weapon');
    this.weapon.setOrigin(0.5, 1);
    this.weapon.setVisible(false);
    
    // Create animations
    this.createAnimations(scene);
    
    // Set depth for rendering order
    this.setDepth(10);
    this.weapon.setDepth(11);
    
    // Initialize inventory
    this.inventory = new Inventory(20); // 20 slots
    
    // Store reference to this entity on the game object for easy access
    this.self.setData('entity', this);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, attackKey: Phaser.Input.Keyboard.Key) {
    if (!cursors) return;
    
    // Handle movement
    this.handleMovement(cursors);
    
    // Handle attack
    this.handleAttack(attackKey);
    
    // Update weapon position
    this.updateWeaponPosition();
  }

  private handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    // Reset velocity
    this.setVelocity(0, 0);
    
    // Handle movement if not attacking
    if (!this.isAttacking) {
      if (cursors.left.isDown) {
        this.setVelocity(-this.moveSpeed, 0);
        this.direction = 'left';
        this.playAnimation('player-left');
      } else if (cursors.right.isDown) {
        this.setVelocity(this.moveSpeed, 0);
        this.direction = 'right';
        this.playAnimation('player-right');
      }
      
      if (cursors.up.isDown) {
        this.setVelocity(this.body.velocity.x, -this.moveSpeed);
        if (!cursors.left.isDown && !cursors.right.isDown) {
          this.direction = 'up';
          this.playAnimation('player-up');
        }
      } else if (cursors.down.isDown) {
        this.setVelocity(this.body.velocity.x, this.moveSpeed);
        if (!cursors.left.isDown && !cursors.right.isDown) {
          this.direction = 'down';
          this.playAnimation('player-down');
        }
      }
      
      // Normalize velocity for diagonal movement
      if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
        this.body.velocity.normalize().scale(this.moveSpeed);
      }
      
      // Idle animation if not moving
      if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        this.playAnimation(`player-idle-${this.direction}`);
      }
    }
  }

  private handleAttack(attackKey: Phaser.Input.Keyboard.Key) {
    const scene = this.self.scene;
    const time = scene.time.now;
    
    if (attackKey.isDown && time > this.lastAttackTime + this.attackCooldown && !this.isAttacking) {
      this.isAttacking = true;
      this.lastAttackTime = time;
      
      // Show weapon
      this.weapon.setVisible(true);
      
      // Play attack animation
      this.playAnimation(`player-attack-${this.direction}`);
      
      // Create attack effect
      const attackEffect = scene.add.sprite(this.x, this.y, 'attack-effect');
      attackEffect.setAlpha(0.7);
      attackEffect.setDepth(9);
      
      // Position attack effect based on direction
      switch (this.direction) {
        case 'up':
          attackEffect.setPosition(this.x, this.y - 20);
          break;
        case 'down':
          attackEffect.setPosition(this.x, this.y + 20);
          break;
        case 'left':
          attackEffect.setPosition(this.x - 20, this.y);
          break;
        case 'right':
          attackEffect.setPosition(this.x + 20, this.y);
          break;
      }
      
      // Animate attack effect
      scene.tweens.add({
        targets: attackEffect,
        alpha: 0,
        scale: 1.5,
        duration: 300,
        onComplete: () => {
          attackEffect.destroy();
        }
      });
      
      // Emit attack event
      scene.events.emit('player-attack');
      
      // Reset attack state after animation
      scene.time.delayedCall(300, () => {
        this.isAttacking = false;
        this.weapon.setVisible(false);
      });
    }
  }

  private updateWeaponPosition() {
    // Position weapon based on player direction
    switch (this.direction) {
      case 'up':
        this.weapon.setPosition(this.x, this.y - 5);
        this.weapon.setAngle(-90);
        this.weapon.setFlipX(false);
        break;
      case 'down':
        this.weapon.setPosition(this.x, this.y + 5);
        this.weapon.setAngle(90);
        this.weapon.setFlipX(false);
        break;
      case 'left':
        this.weapon.setPosition(this.x - 5, this.y);
        this.weapon.setAngle(180);
        this.weapon.setFlipX(false);
        break;
      case 'right':
        this.weapon.setPosition(this.x + 5, this.y);
        this.weapon.setAngle(0);
        this.weapon.setFlipX(false);
        break;
    }
  }

  private createAnimations(scene: Phaser.Scene) {
    // Create player animations
    scene.anims.create({
      key: 'player-down',
      frames: [
        { key: 'player-down-1' },
        { key: 'player-down-2' }
      ],
      frameRate: 8,
      repeat: -1
    });
    
    scene.anims.create({
      key: 'player-up',
      frames: [
        { key: 'player-up-1' },
        { key: 'player-up-2' }
      ],
      frameRate: 8,
      repeat: -1
    });
    
    scene.anims.create({
      key: 'player-left',
      frames: [
        { key: 'player-left-1' },
        { key: 'player-left-2' }
      ],
      frameRate: 8,
      repeat: -1
    });
    
    scene.anims.create({
      key: 'player-right',
      frames: [
        { key: 'player-right-1' },
        { key: 'player-right-2' }
      ],
      frameRate: 8,
      repeat: -1
    });
    
    // Idle animations
    scene.anims.create({
      key: 'player-idle-down',
      frames: [{ key: 'player-down-1' }],
      frameRate: 1
    });
    
    scene.anims.create({
      key: 'player-idle-up',
      frames: [{ key: 'player-up-1' }],
      frameRate: 1
    });
    
    scene.anims.create({
      key: 'player-idle-left',
      frames: [{ key: 'player-left-1' }],
      frameRate: 1
    });
    
    scene.anims.create({
      key: 'player-idle-right',
      frames: [{ key: 'player-right-1' }],
      frameRate: 1
    });
    
    // Attack animations
    scene.anims.create({
      key: 'player-attack-down',
      frames: [{ key: 'player-down-1' }],
      frameRate: 1
    });
    
    scene.anims.create({
      key: 'player-attack-up',
      frames: [{ key: 'player-up-1' }],
      frameRate: 1
    });
    
    scene.anims.create({
      key: 'player-attack-left',
      frames: [{ key: 'player-left-1' }],
      frameRate: 1
    });
    
    scene.anims.create({
      key: 'player-attack-right',
      frames: [{ key: 'player-right-1' }],
      frameRate: 1
    });
  }

  public takeDamage(amount: number) {
    if (this.isInvulnerable) return;
    
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
    
    // Flash player when hit
    scene.tweens.add({
      targets: this.self,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 3
    });
    
    // Emit health changed event
    this.emit('health-changed');
  }

  public setInvulnerable(isInvulnerable: boolean) {
    this.isInvulnerable = isInvulnerable;
    
    if (isInvulnerable) {
      const scene = this.self.scene;
      
      // Clear existing timer if there is one
      if (this.invulnerabilityTimer) {
        this.invulnerabilityTimer.remove();
      }
      
      // Set timer to remove invulnerability
      this.invulnerabilityTimer = scene.time.delayedCall(
        this.invulnerabilityTime,
        () => {
          this.isInvulnerable = false;
        }
      );
    }
  }

  public gainExperience(amount: number) {
    this.experience += amount;
    
    // Check for level up
    if (this.experience >= this.experienceToNextLevel) {
      this.levelUp();
    }
    
    // Emit experience changed event
    this.emit('experience-changed');
  }

  private levelUp() {
    this.level++;
    this.experience -= this.experienceToNextLevel;
    
    // Increase stats
    this.maxHealth += 20;
    this.health = this.maxHealth;
    this.attackDamage += 5;
    this.moveSpeed += 10;
    
    // Increase experience required for next level
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
    
    const scene = this.self.scene;
    
    // Create level up effect
    const levelUpEffect = scene.add.sprite(this.x, this.y, 'attack-effect');
    levelUpEffect.setTint(0xffff00);
    levelUpEffect.setAlpha(0.7);
    levelUpEffect.setDepth(9);
    
    // Animate level up effect
    scene.tweens.add({
      targets: levelUpEffect,
      alpha: 0,
      scale: 2,
      duration: 500,
      onComplete: () => {
        levelUpEffect.destroy();
      }
    });
    
    // Emit level changed event
    this.emit('level-changed');
    this.emit('health-changed');
  }

  // Add item to inventory
  public collectItem(item: Item): boolean {
    const itemData = item.getData();
    const added = this.inventory.addItem(itemData);
    
    if (added) {
      // Apply immediate effects if needed
      this.applyItemEffects(itemData);
      
      // Create pickup effect
      const scene = this.self.scene;
      const pickupEffect = scene.add.sprite(this.x, this.y, 'pickup-effect');
      pickupEffect.setAlpha(0.7);
      pickupEffect.setDepth(9);
      
      // Animate pickup effect
      scene.tweens.add({
        targets: pickupEffect,
        alpha: 0,
        scale: 1.5,
        duration: 300,
        onComplete: () => {
          pickupEffect.destroy();
        }
      });
      
      // Emit inventory changed event
      this.emit('inventory-changed');
      
      return true;
    }
    
    return false;
  }

  // Apply immediate effects from collected items
  private applyItemEffects(itemData: ItemData) {
    switch (itemData.type) {
      case ItemType.HEALTH_POTION:
        // Heal player
        this.health = Math.min(this.health + itemData.value, this.maxHealth);
        this.emit('health-changed');
        break;
      case ItemType.GOLD:
        // Gold is just stored in inventory
        break;
      case ItemType.WEAPON:
        // Equip weapon (would be handled by inventory system)
        break;
      case ItemType.ARMOR:
        // Equip armor (would be handled by inventory system)
        break;
    }
  }

  // Use item from inventory
  public useItem(slotIndex: number): boolean {
    const item = this.inventory.getItem(slotIndex);
    
    if (!item) return false;
    
    // Apply item effects
    this.applyItemEffects(item);
    
    // Remove item from inventory if it's consumable
    if (item.type === ItemType.HEALTH_POTION || item.type === ItemType.MANA_POTION) {
      this.inventory.removeItem(slotIndex, 1);
      this.emit('inventory-changed');
    }
    
    return true;
  }

  destroy() {
    if (this.weapon) {
      this.weapon.destroy();
    }
    super.destroy();
  }
}
