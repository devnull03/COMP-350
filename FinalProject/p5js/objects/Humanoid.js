class Humanoid {
  constructor(x, y, z, size) {
    this.pos = createVector(x, y, z);
    this.size = size;
    this.speed = 10.0;
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.yaw = 0.0; 
    this.pitch = 0.0;
    this.velocity = createVector(0, 0, 0);
    
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.maxArmor = 100;
    this.armor = 0;
  }
  
  update() {
    let forward = createVector(sin(this.yaw), 0, cos(this.yaw));
    let right = createVector(sin(this.yaw + PI/2), 0, cos(this.yaw + PI/2));
    
    this.velocity.set(0, 0, 0);
    
    if (this.moveForward) {
      this.velocity.add(p5.Vector.mult(forward, this.speed));
    }
    if (this.moveBackward) {
      this.velocity.add(p5.Vector.mult(forward, -this.speed));
    }
    if (this.moveLeft) {
      this.velocity.add(p5.Vector.mult(right, this.speed));
    }
    if (this.moveRight) {
      this.velocity.add(p5.Vector.mult(right, -this.speed)); 
    }

    this.pos.add(this.velocity);
    
    if (typeof room !== 'undefined' && room !== null) {
      this.pos.x = constrain(this.pos.x, -room.width/2 + this.size, room.width/2 - this.size);
      this.pos.y = constrain(this.pos.y, -room.height/2 + this.size, room.height/2 - this.size);
      this.pos.z = constrain(this.pos.z, -room.depth/2 + this.size, room.depth/2 - this.size);
    }
  }
  
  getDirection() {
    return createVector(
      sin(this.yaw) * cos(this.pitch),
      sin(this.pitch),
      cos(this.yaw) * cos(this.pitch)
    ).normalize(); 
  }
  
  resetPosition() {
    this.pos = createVector(0, 0, 0);
    this.yaw = 0;
    this.pitch = 0;
  }
  
  takeDamage(amount) {
    if (this.armor > 0) {
      if (amount <= this.armor) {
        this.armor -= amount;
        amount = 0;
      } else {
        amount -= this.armor;
        this.armor = 0;
      }
    }
    
    this.health = max(0, this.health - amount);
    
    if (this.health <= 0) {
      this.die();
    }
  }
  
  heal(amount) {
    this.health = min(this.maxHealth, this.health + amount);
  }
  
  addArmor(amount) {
    this.armor = min(this.maxArmor, this.armor + amount);
  }
  
  die() {
    this.resetPosition();
    this.health = this.maxHealth;
    this.armor = 0;
  }
}
