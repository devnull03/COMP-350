class Humanoid {
  constructor(x, y, z, size) {
    // Position and movement properties
    this.pos = createVector(x, y, z);
    this.size = size;
    this.speed = 10.0;
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.yaw = 0.0; // Rotation around Y-axis
    this.pitch = 0.0; // Rotation around X-axis
    this.velocity = createVector(0, 0, 0);
    
    // Stats
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.maxArmor = 100;
    this.armor = 0;
  }
  
  update() {
    // Calculate movement direction based on yaw
    let forward = createVector(sin(this.yaw), 0, cos(this.yaw));
    let right = createVector(sin(this.yaw + PI/2), 0, cos(this.yaw + PI/2));
    
    // Reset velocity
    this.velocity.set(0, 0, 0);
    
    // Apply movement based on keys pressed
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

    // Apply velocity to position
    this.pos.add(this.velocity);
    
    // Constrain to room boundaries if there's a room
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
  
  // Position resetting
  resetPosition() {
    this.pos = createVector(0, 0, 0);
    this.yaw = 0;
    this.pitch = 0;
  }
  
  // Health and damage handling
  takeDamage(amount) {
    // Armor absorbs damage first
    if (this.armor > 0) {
      if (amount <= this.armor) {
        this.armor -= amount;
        amount = 0;
      } else {
        amount -= this.armor;
        this.armor = 0;
      }
    }
    
    // Remaining damage affects health
    this.health = max(0, this.health - amount);
    
    // Check if died
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
