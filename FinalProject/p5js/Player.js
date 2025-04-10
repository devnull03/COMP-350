class Player {
  constructor(x, y, z, size, weapons) {
    // Position and movement properties
    this.pos = createVector(x, y, z);
    this.size = size;
    this.speed = 5.0;
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.yaw = 0.0; // Rotation around Y-axis
    this.pitch = 0.0; // Rotation around X-axis
    this.velocity = createVector(0, 0, 0);
    
    // Mouse properties
    this.prevMouseX = width / 2;
    this.prevMouseY = height / 2;
    this.sensitivity = 0.003;
    
    // Player stats
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.maxArmor = 100;
    this.armor = 0;
    
    // Weapon handling
    this.weapons = weapons;
    this.currentWeaponIndex = 0;
    this.isFiring = false;
     
  }
  
  update() {
    // Calculate movement direction based on yaw
    let forward = createVector(sin(this.yaw), 0, cos(this.yaw));
    let right = createVector(sin(this.yaw + PI/2), 0, cos(this.yaw + PI/2));
    
    // Reset velocity
    this.velocity.set(0, 0, 0);
    
    // Apply movement based on keys pressed - fixed A/D directions
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
    
    // Constrain player to room boundaries
    this.pos.x = constrain(this.pos.x, -room.width/2 + this.size, room.width/2 - this.size);
    this.pos.y = constrain(this.pos.y, -room.height/2 + this.size, room.height/2 - this.size);
    this.pos.z = constrain(this.pos.z, -room.depth/2 + this.size, room.depth/2 - this.size);
    
    // Update camera with first-person view
    camera(
      this.pos.x, this.pos.y, this.pos.z,  // Camera position
      this.pos.x + sin(this.yaw) * cos(this.pitch), 
      this.pos.y + sin(this.pitch), 
      this.pos.z + cos(this.yaw) * cos(this.pitch),  // Look-at point
      0, 1, 0  // Up vector
    );

    // Update current weapon
    if (this.hasWeapon()) {
      this.getCurrentWeapon().update();
      
      // Handle firing
      if (this.isFiring) {
        this.getCurrentWeapon().fire(this.pos, this.getDirection());

      }
      
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
    // Reset player to center of room
    this.pos = createVector(0, 0, 0);
    
    // Reset look direction
    this.yaw = 0;
    this.pitch = 0;
    
    // Reset mouse tracking
    this.prevMouseX = windowWidth / 2;
    this.prevMouseY = windowHeight / 2;
  }
  
  handleMouseLook(movementX, movementY) {
    if (!gameState) return;
    
    // With pointer lock, we use the movementX and movementY directly
    // No need to compare with previous position
    
    // Update rotation based on mouse movement
    this.yaw -= movementX * this.sensitivity;
    this.pitch += movementY * this.sensitivity; // INVERTED Y-axis
    
    // Limit pitch to prevent flipping
    this.pitch = constrain(this.pitch, -PI/2 + 0.1, PI/2 - 0.1);
  }
  
  handleKeyPressed(key, keyCode) {
    if (key === 'w' || key === 'W') this.moveForward = true;
    if (key === 's' || key === 'S') this.moveBackward = true;
    if (key === 'a' || key === 'A') this.moveLeft = true;    
    if (key === 'd' || key === 'D') this.moveRight = true;    

    // Weapon switching
    if (key === '1' && this.weapons.length >= 1) this.switchWeapon(0);
    if (key === '2' && this.weapons.length >= 2) this.switchWeapon(1);
    if (key === '3' && this.weapons.length >= 3) this.switchWeapon(2);
    
    // Next/previous weapon
    if (key === 'q' || key === 'Q') this.prevWeapon();
    if (key === 'e' || key === 'E') this.nextWeapon();
    
    // Reload weapon
    if (key === 'r' || key === 'R') {
      if (this.hasWeapon()) {
        this.getCurrentWeapon().reload();
      }
    }

    if (this.hasWeapon()) {
      this.isFiring = true;
    }
  }
  
  
  handleKeyReleased(key, keyCode) {
    if (key === 'w' || key === 'W') this.moveForward = false;
    if (key === 's' || key === 'S') this.moveBackward = false;
    if (key === 'a' || key === 'A') this.moveLeft = false;  
	  if (key === 'd' || key === 'D') this.moveRight = false;

    this.isFiring = false;
  }

  // Weapon methods
  hasWeapon() {
    return this.weapons.length > 0;
  }
  
  getCurrentWeapon() {
    if (this.hasWeapon()) {
      return this.weapons[this.currentWeaponIndex];
    }
    return null;
  }
  
  addWeapon(weapon) {
    this.weapons.push(weapon);
    // Switch to the new weapon
    this.currentWeaponIndex = this.weapons.length - 1;
  }
  
  switchWeapon(index) {
    if (index >= 0 && index < this.weapons.length) {
      this.currentWeaponIndex = index;
    }
  }
  
  nextWeapon() {
    if (this.hasWeapon()) {
      this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weapons.length;
    }
  }
  
  prevWeapon() {
    if (this.hasWeapon()) {
      this.currentWeaponIndex = (this.currentWeaponIndex - 1 + this.weapons.length) % this.weapons.length;
    }
  }
  
  // Player stat methods
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
    
    // Check if player died
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
    // Reset player
    this.resetPosition();
    this.health = this.maxHealth;
    this.armor = 0;
    
    // Notify game state
    if (gameState) {
      gameState.playerDied();
    }
  }
} 