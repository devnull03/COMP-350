class EnvironmentHandler {
  constructor() {
    this.entities = {
      enemies: [],
      environmentObjects: [],
      pickups: []
    };
  }
  
  addEnemy(enemy) {
    this.entities.enemies.push(enemy);
  }
  
  addEnvironmentObject(object) {
    this.entities.environmentObjects.push(object);
  }
  
  addPickup(pickup) {
    this.entities.pickups.push(pickup);
  }
  
  update() {
    // Update all entities that need regular updates
    this.updateEnemies();
    // Could add other entity updates here
  }
  
  updateEnemies() {
    for (let enemy of this.entities.enemies) {
      enemy.update();
    }
  }
  
  display() {
    // Display all entities
    this.displayEnemies();
    // Could add other entity displays here
  }
  
  displayEnemies() {
    for (let enemy of this.entities.enemies) {
      enemy.display();
    }
  }
  
  // Bullet collision detection moved from sketch.js
  checkBulletCollisions(player) {
    if (!player || !player.hasWeapon()) return;
    
    let currentWeapon = player.getCurrentWeapon();
    if (!currentWeapon || !currentWeapon.bullets || !Array.isArray(currentWeapon.bullets) || currentWeapon.bullets.length === 0) return;
    
    // Check collision with enemies
    for (let i = currentWeapon.bullets.length - 1; i >= 0; i--) {
      let bullet = currentWeapon.bullets[i];
      if (!bullet) {
        // Remove invalid bullets
        currentWeapon.bullets.splice(i, 1);
        continue;
      }
      
      let hitDetected = false;
      
      // Check enemies
      for (let j = this.entities.enemies.length - 1; j >= 0; j--) {
        if (!this.entities.enemies[j]) continue;
        
        try {
          if (this.entities.enemies[j].checkBulletCollision(bullet)) {
            hitDetected = true;
            break;
          }
        } catch (error) {
          console.error("Error in bullet collision detection:", error);
          // Continue with next enemy if one causes an error
          continue;
        }
      }
      
      // Check room colliders (walls, obstacles)
      if (!hitDetected && room) {
        if (room.checkBulletCollision(bullet)) {
          hitDetected = true;
        }
      }
      
      if (hitDetected) {
        // Remove the bullet if it hit something
        currentWeapon.bullets.splice(i, 1);
      }
    }
  }
  
  // Player collision with environment
  checkPlayerEnvironmentCollisions(player) {
    if (!player || !room) return;
    
    // Check and resolve room collisions
    room.resolvePlayerCollision(player);
  }
  
  // Player collision with enemies
  checkPlayerEnemyCollisions(player) {
    for (let enemy of this.entities.enemies) {
      if (!enemy.active || enemy.health <= 0) continue;
      
      // Simple distance-based collision
      let distance = p5.Vector.dist(player.pos, enemy.pos);
      if (distance < player.size + enemy.size) {
        // Push player away from enemy
        let pushDirection = p5.Vector.sub(player.pos, enemy.pos).normalize();
        player.pos.add(p5.Vector.mult(pushDirection, 2.0));
      }
    }
  }
  
  // Combined collision check method for simplicity
  checkAllCollisions(player) {
    this.checkBulletCollisions(player);
    this.checkPlayerEnvironmentCollisions(player);
    this.checkPlayerEnemyCollisions(player);
  }
  
  // Add method to clean up dead enemies
  cleanupDeadEnemies() {
    for (let i = this.entities.enemies.length - 1; i >= 0; i--) {
      if (!this.entities.enemies[i].active) {
        this.entities.enemies.splice(i, 1);
      }
    }
  }
  
  // Get array of enemies
  getEnemies() {
    return this.entities.enemies;
  }
  
  // Get count of active enemies
  getActiveEnemyCount() {
    return this.entities.enemies.filter(enemy => enemy.active).length;
  }
}
