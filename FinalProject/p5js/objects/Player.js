class Player extends Humanoid {
  constructor(x, y, z, size, weapons) {
    super(x, y, z, size);
    
    this.prevMouseX = width / 2;
    this.prevMouseY = height / 2;
    this.sensitivity = 0.003;
    this.speed = 30.0;
    
    this.weapons = weapons;
    this.currentWeaponIndex = 0;
    this.isFiring = false;
  }
  
  update() {
    super.update();
    
    camera(
      this.pos.x, this.pos.y, this.pos.z,  // Camera position
      this.pos.x + sin(this.yaw) * cos(this.pitch), 
      this.pos.y + sin(this.pitch), 
      this.pos.z + cos(this.yaw) * cos(this.pitch),  // Look-at point
      0, 1, 0  // Up vector
    );

    if (this.hasWeapon()) {
      this.getCurrentWeapon().update();
      
      if (this.isFiring) {
        const firePosition = this.pos.copy();
        firePosition.y -= 10;
        this.getCurrentWeapon().fire(firePosition, this.getDirection());
      }
    }
  }
  
  resetPosition() {
    super.resetPosition();
    
    this.prevMouseX = windowWidth / 2;
    this.prevMouseY = windowHeight / 2;
  }
  
  handleMouseLook(movementX, movementY) {
    if (!gameState) return;
    
    this.yaw -= movementX * this.sensitivity;
    this.pitch += movementY * this.sensitivity;
    
    this.pitch = constrain(this.pitch, -PI/2 + 0.1, PI/2 - 0.1);
  }
  
  handleKeyPressed(key, keyCode) {
    if (key === 'w' || key === 'W') this.moveForward = true;
    if (key === 's' || key === 'S') this.moveBackward = true;
    if (key === 'a' || key === 'A') this.moveLeft = true;    
    if (key === 'd' || key === 'D') this.moveRight = true;    

    if (key === '1' && this.weapons.length >= 1) this.switchWeapon(0);
    if (key === '2' && this.weapons.length >= 2) this.switchWeapon(1);
    if (key === '3' && this.weapons.length >= 3) this.switchWeapon(2);
    
    if (key === 'q' || key === 'Q') this.prevWeapon();
    if (key === 'e' || key === 'E') this.nextWeapon();
    
    if (key === 'r' || key === 'R') {
      if (this.hasWeapon()) {
        this.getCurrentWeapon().reload();
      }
    }
  }
  
  handleKeyReleased(key, keyCode) {
    if (key === 'w' || key === 'W') this.moveForward = false;
    if (key === 's' || key === 'S') this.moveBackward = false;
    if (key === 'a' || key === 'A') this.moveLeft = false;  
	if (key === 'd' || key === 'D') this.moveRight = false;

    this.isFiring = false;
  }

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
  
  die() {
    super.die();
    
    if (gameState) {
      gameState.playerDied();
    }
  }
}