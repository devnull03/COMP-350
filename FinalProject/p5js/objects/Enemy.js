class Enemy extends Humanoid {
  constructor(x, z, size, enemyModel = null, enemyType = 'basic') {
    const y = size / 2;
    super(x, y, z, size);
    
    this.enemyType = enemyType;
    this.speed = 10;
    this.detectionRange = 500;
    this.attackRange = 50;
    this.attackDamage = 10;
    this.attackCooldown = 1000;
    this.lastAttackTime = 0;
    this.active = true;
    this.model = enemyModel;
    this.modelScale = 3;
    this.modelYOffset = 0; 
    this.modelRotation = 0; 
    
    this.baseModelWidth = 40; 
    this.baseModelHeight = 700;
    this.baseModelDepth = 40; 
    
    this.state = 'idle';
    
    switch (enemyType) {
      case 'fast':
        this.speed = 20;
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
    
    if (this.model) {
      this.model.materialColor = this.color;
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
    scale(this.modelScale);
    
    if (this.model) {
      push();
      rotateX(-PI/2);
      rotateZ(PI);
      translate(0, this.modelYOffset, 0);

      noStroke();
      fill(this.color);
      specularMaterial(this.color);
      shininess(5);
      model(this.model);
      
      pop();
      
      this.displayHealthBar();
    } else {
      fill(this.color);
      noStroke();
      box(this.baseModelWidth, this.baseModelHeight, this.baseModelDepth);
      this.displayHealthBar();
    }
    
    pop();
  }
  
  displayHealthBar() {
    push();
    translate(0, -this.baseModelHeight * this.modelScale * 1.5, 0);
    rotateY(-this.yaw);
    
    fill(100);
    noStroke();
    rect(-this.baseModelWidth * this.modelScale, -5, this.baseModelWidth * this.modelScale * 2, 5); // Updated to use scaled width
    
    let healthPercent = this.health / this.maxHealth;
    fill(255 * (1 - healthPercent), 255 * healthPercent, 0);
    rect(-this.baseModelWidth * this.modelScale, -5, this.baseModelWidth * this.modelScale * 2 * healthPercent, 5); // Updated to use scaled width
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
    
    const hitboxSize = this.getHitboxSize(); 
    
    let distance = p5.Vector.dist(this.pos, bullet.position);
    if (distance < hitboxSize) {
      const bulletDamage = bullet.damage || 10;
      this.takeDamage(bulletDamage);
      return true;
    }
    return false;
  }
  
  getHitboxSize() {
    return (this.baseModelWidth * this.modelScale + 
            this.baseModelHeight * this.modelScale + 
            this.baseModelDepth * this.modelScale) / 3;
  }
}
