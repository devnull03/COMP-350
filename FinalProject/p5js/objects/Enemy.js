class Enemy extends Humanoid {
  constructor(x, y, z, size, enemyType = 'basic') {
    super(x, y, z, size);
    
    // Enemy specific properties
    this.enemyType = enemyType;
    this.speed = 2.0; // Slower than player
    this.detectionRange = 500; // How far the enemy can see
    this.attackRange = 50; // How close the enemy needs to be to attack
    this.attackDamage = 10;
    this.attackCooldown = 1000; // ms between attacks
    this.lastAttackTime = 0;
    this.active = true;
    
    // AI states
    this.state = 'idle'; // 'idle', 'chase', 'attack', 'retreat'
    
    // Set enemy-specific properties based on type
    switch (enemyType) {
      case 'fast':
        this.speed = 4.0;
        this.health = 50;
        this.attackDamage = 5;
        this.attackCooldown = 500;
        this.color = color(255, 100, 100);
        break;
      case 'heavy':
        this.speed = 1.0;
        this.health = 200;
        this.attackDamage = 20;
        this.attackCooldown = 2000;
        this.color = color(100, 100, 255);
        break;
      default: // 'basic'
        this.color = color(255, 0, 0);
        break;
    }
  }
  
  update() {
    if (!this.active || this.health <= 0) return;
    
    // AI behavior
    if (player) {
      // Calculate distance to player
      let distanceToPlayer = p5.Vector.dist(this.pos, player.pos);
      
      // Update state based on distance
      if (distanceToPlayer <= this.attackRange) {
        this.state = 'attack';
      } else if (distanceToPlayer <= this.detectionRange) {
        this.state = 'chase';
      } else {
        this.state = 'idle';
      }
      
      // Act based on state
      switch(this.state) {
        case 'chase':
          this.chasePlayer();
          break;
        case 'attack':
          this.attackPlayer();
          break;
        case 'idle':
          this.idle();
          break;
        default:
          break;
      }
    }
    
    // Call parent update after setting movement flags
    super.update();
  }
  
  chasePlayer() {
    if (!player) return;
    
    // Calculate direction to player
    let directionToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();
    
    // Set yaw to face player (calculate angle in the xz plane)
    this.yaw = atan2(directionToPlayer.x, directionToPlayer.z);
    
    // Move toward player
    this.moveForward = true;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
  }
  
  attackPlayer() {
    if (!player) return;
    
    // Face the player
    let directionToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();
    this.yaw = atan2(directionToPlayer.x, directionToPlayer.z);
    
    // Stop movement when attacking
    this.moveForward = false;
    
    // Attack if cooldown is over
    let currentTime = millis();
    if (currentTime - this.lastAttackTime > this.attackCooldown) {
      // Deal damage to player
      player.takeDamage(this.attackDamage);
      
      // Reset cooldown
      this.lastAttackTime = currentTime;
    }
  }
  
  idle() {
    // In idle state, stand still or do random patrol
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    
    // Could implement patrolling behavior here
  }
  
  display() {
    if (!this.active) return;
    
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateY(this.yaw);
    
    // Set enemy color
    fill(this.color);
    noStroke();
    
    // Basic enemy shape (can be replaced with models later)
    box(this.size, this.size * 2, this.size);
    
    // Draw health bar above enemy
    this.displayHealthBar();
    
    pop();
  }
  
  displayHealthBar() {
    push();
    // Position health bar above enemy
    translate(0, -this.size * 1.5, 0);
    rotateY(-this.yaw); // Make health bar face camera
    
    // Health bar background
    fill(100);
    noStroke();
    rect(-this.size, -5, this.size * 2, 5);
    
    // Health bar fill
    let healthPercent = this.health / this.maxHealth;
    fill(255 * (1 - healthPercent), 255 * healthPercent, 0);
    rect(-this.size, -5, this.size * 2 * healthPercent, 5);
    pop();
  }
  
  die() {
    super.die();
    
    // Add any enemy-specific death behavior
    this.active = false;
    
    // Could add death animation, drop items, etc.
    console.log(`Enemy (${this.enemyType}) has been defeated!`);
    
    // Remove enemy from game after a delay
    setTimeout(() => {
      // Assuming enemies are stored in an array
      if (typeof enemies !== 'undefined' && enemies !== null) {
        const index = enemies.indexOf(this);
        if (index > -1) {
          enemies.splice(index, 1);
        }
      }
    }, 3000);
  }
  
  takeDamage(amount) {
    super.takeDamage(amount);
    
    // Enemy-specific damage behavior (like changing color or playing sound)
    if (this.health > 0) {
      // Flash the enemy when taking damage
      this.color = color(255, 255, 255);
      setTimeout(() => {
        // Reset to original color
        switch (this.enemyType) {
          case 'fast':
            this.color = color(255, 100, 100);
            break;
          case 'heavy':
            this.color = color(100, 100, 255);
            break;
          default:
            this.color = color(255, 0, 0);
        }
      }, 100);
    }
  }
  
  // Method to check for collision with bullets
  checkBulletCollision(bullet) {
    if (!this.active || !bullet || typeof bullet !== 'object') {
      return false;
    }
    
    // Make sure bullet has a valid position property
    if (!bullet.position || !bullet.position.x || !bullet.position.y || !bullet.position.z) {
      console.warn('Bullet missing proper position vector');
      return false;
    }
    
    // Check if bullet has a size property, use default if not
    const bulletSize = bullet.size || 5;
    
    // Simple distance-based collision check
    let distance = p5.Vector.dist(this.pos, bullet.position);
    if (distance < this.size + bulletSize) {
      // Make sure bullet has a damage property, use default if not
      const bulletDamage = bullet.damage || 10;
      this.takeDamage(bulletDamage);
      return true; // Collision occurred
    }
    return false;
  }
}
