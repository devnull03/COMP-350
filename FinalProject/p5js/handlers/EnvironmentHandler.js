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
    this.updateEnemies();
  }
  
  updateEnemies() {
    for (let enemy of this.entities.enemies) {
      enemy.update();
    }
  }
  
  display() {
    this.displayEnemies();
  }
  
  displayEnemies() {
    for (let enemy of this.entities.enemies) {
      enemy.display();
    }
  }
  
  checkBulletCollisions(player) {
    if (!player || !player.hasWeapon()) return;
    
    let currentWeapon = player.getCurrentWeapon();
    if (!currentWeapon || !currentWeapon.bullets || !Array.isArray(currentWeapon.bullets) || currentWeapon.bullets.length === 0) return;
    
    for (let i = currentWeapon.bullets.length - 1; i >= 0; i--) {
      let bullet = currentWeapon.bullets[i];
      if (!bullet) {
        currentWeapon.bullets.splice(i, 1);
        continue;
      }
      
      let hitDetected = false;
      
      for (let j = this.entities.enemies.length - 1; j >= 0; j--) {
        if (!this.entities.enemies[j]) continue;
        
        try {
          if (this.entities.enemies[j].checkBulletCollision(bullet)) {
            hitDetected = true;
            break;
          }
        } catch (error) {
          console.error("Error in bullet collision detection:", error);
          continue;
        }
      }
      
      if (!hitDetected && room) {
        if (room.checkBulletCollision(bullet)) {
          hitDetected = true;
        }
      }
      
      if (hitDetected) {
        currentWeapon.bullets.splice(i, 1);
      }
    }
  }
  
  checkPlayerEnvironmentCollisions(player) {
    if (!player || !room) return;
    
    room.resolvePlayerCollision(player);
  }
  
  checkPlayerEnemyCollisions(player) {
    for (let enemy of this.entities.enemies) {
      if (!enemy.active || enemy.health <= 0) continue;
      
      let distance = p5.Vector.dist(player.pos, enemy.pos);
      if (distance < player.size + enemy.getHitboxSize()) {
        let pushDirection = p5.Vector.sub(player.pos, enemy.pos).normalize();
        player.pos.add(p5.Vector.mult(pushDirection, 2.0));
      }
    }
  }
  
  checkAllCollisions(player) {
    this.checkBulletCollisions(player);
    this.checkPlayerEnvironmentCollisions(player);
    this.checkPlayerEnemyCollisions(player);
  }
  
  cleanupDeadEnemies() {
    for (let i = this.entities.enemies.length - 1; i >= 0; i--) {
      if (!this.entities.enemies[i].active) {
        this.entities.enemies.splice(i, 1);
      }
    }
  }
  
  getEnemies() {
    return this.entities.enemies;
  }
  
  getActiveEnemyCount() {
    return this.entities.enemies.filter(enemy => enemy.active).length;
  }
}
