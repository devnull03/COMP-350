class Enemy extends Humanoid {
  constructor(x, y, z, size, enemyType = 'basic') {
    super(x, y, z, size);
    
    this.enemyType = enemyType;
    this.speed = 2.0;
    this.detectionRange = 500;
    this.attackRange = 50;
    this.attackDamage = 10;
    this.attackCooldown = 1000;
    this.lastAttackTime = 0;
    this.active = true;
    
    this.state = 'idle';
    
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
      default:
        this.color = color(255, 0, 0);
        break;
    }
  }
  
  update() {
    if (!this.active || this.health <= 0) return;
    
    if (player) {
      let distanceToPlayer = p5.Vector.dist(this.pos, player.pos);
      
      if (distanceToPlayer <= this.attackRange) {
        this.state = 'attack';
      } else if (distanceToPlayer <= this.detectionRange) {
        this.state = 'chase';
      } else {
        this.state = 'idle';
      }
      
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
    
    super.update();
  }
  
  chasePlayer() {
    if (!player) return;
    
    let directionToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();
    
    this.yaw = atan2(directionToPlayer.x, directionToPlayer.z);
    
    this.moveForward = true;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
  }
  
  attackPlayer() {
    if (!player) return;
    
    let directionToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();
    this.yaw = atan2(directionToPlayer.x, directionToPlayer.z);
    
    this.moveForward = false;
    
    let currentTime = millis();
    if (currentTime - this.lastAttackTime > this.attackCooldown) {
      player.takeDamage(this.attackDamage);
      this.lastAttackTime = currentTime;
    }
  }
  
  idle() {
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
  }
  
  display() {
    if (!this.active) return;
    
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateY(this.yaw);
    
    fill(this.color);
    noStroke();
    
    box(this.size, this.size * 2, this.size);
    
    this.displayHealthBar();
    
    pop();
  }
  
  displayHealthBar() {
    push();
    translate(0, -this.size * 1.5, 0);
    rotateY(-this.yaw);
    
    fill(100);
    noStroke();
    rect(-this.size, -5, this.size * 2, 5);
    
    let healthPercent = this.health / this.maxHealth;
    fill(255 * (1 - healthPercent), 255 * healthPercent, 0);
    rect(-this.size, -5, this.size * 2 * healthPercent, 5);
    pop();
  }
  
  die() {
    super.die();
    
    this.active = false;
    
    console.log(`Enemy (${this.enemyType}) has been defeated!`);
    
    setTimeout(() => {
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
    
    if (this.health > 0) {
      this.color = color(255, 255, 255);
      setTimeout(() => {
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
  
  checkBulletCollision(bullet) {
    if (!this.active || !bullet || typeof bullet !== 'object') {
      return false;
    }
    
    if (!bullet.position || !bullet.position.x || !bullet.position.y || !bullet.position.z) {
      return false;
    }
    
    const bulletSize = bullet.size || 5;
    
    let distance = p5.Vector.dist(this.pos, bullet.position);
    if (distance < this.size + bulletSize) {
      const bulletDamage = bullet.damage || 10;
      this.takeDamage(bulletDamage);
      return true;
    }
    return false;
  }
}
