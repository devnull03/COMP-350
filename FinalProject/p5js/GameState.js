class GameState {
  constructor() {
    this.isPaused = false;
    this.showControls = false;
    this.pointerLocked = false;
    
    // Game stats
    this.playerDeaths = 0;
    this.gameStartTime = 0;
    this.gameTime = 0;

    // Add HUD type option
    this.hudType = 0; // 0 = classic, 1 = modern
  }
  
  displayMainMenu() {
    // Reset camera for UI
    camera();
    push();
    
   
    // Move to 2D rendering temporarily
    translate(-width/2, -height/2, 0);
    fill(0, 0, 0, 150);
    noStroke();
    rect(0, 0, width, height);
    
    textSize(40);
    textAlign(CENTER, CENTER);
    fill(255);
    text("3D Room Navigation", width/2, height/4);
    
    textSize(20);
    text("Press SPACE to play", width/2, height/2);
    text("Press C for controls", width/2, height/2 + 40);
    text("Press H to change HUD style", width/2, height/2 + 80);
    
    pop();
  }
  
  displayControls() {
    // Reset camera for UI
    camera();
    push();
     
    // Move to 2D rendering temporarily
    translate(-width/2, -height/2, 0);
    fill(0, 0, 0, 150);
    noStroke();
    rect(0, 0, width, height);
    
    textSize(30);
    textAlign(CENTER, CENTER);
    fill(255);
    text("Controls", width/2, height/4);
    
    textSize(16);
    // Movement controls
    text("W/S: Move forward/backward", width/2, height/2 - 80);
    text("A/D: Move left/right", width/2, height/2 - 60);
    text("Mouse: Look around", width/2, height/2 - 40);
    
    // Weapon controls
    text("Mouse click: Fire weapon", width/2, height/2 - 10);
    text("R: Reload weapon", width/2, height/2 + 10);
    text("1: BFG, 2: Pistol", width/2, height/2 + 30);
    text("Q/E: Previous/next weapon", width/2, height/2 + 50);
    
    // General controls
    text("ESC: Pause game", width/2, height/2 + 80);
    text("Press C to return", width/2, height/2 + 120);
    
    pop();
  }
  
  displayHUD(player) {
    if (this.isPaused || this.showControls) return;
    
    if (this.hudType === 0) {
      this.displayClassicHUD(player);
    } else {
      this.displayModernHUD(player);
    }
  }
  
  displayClassicHUD(player) {
    camera();
    push();
    drawingContext.disable(drawingContext.DEPTH_TEST);
    
    translate(-width/2, -height/2);
    
    textAlign(LEFT, TOP);
    fill(255);
    textSize(14);
    text(`X: ${player.pos.x.toFixed(1)} Y: ${player.pos.y.toFixed(1)} Z: ${player.pos.z.toFixed(1)}`, 10, 10);
    
    textSize(16);
    fill(255, 0, 0); // Red for health
    text(`HEALTH: ${player.health}`, 10, height - 60);
    fill(0, 100, 255); // Blue for armor
    text(`ARMOR: ${player.armor}`, 10, height - 30);
    
    if (player.hasWeapon()) {
      let weapon = player.getCurrentWeapon();
      if (weapon) {
        textAlign(RIGHT, BOTTOM);
        fill(255);
        textSize(16);
        text(`${weapon.name}`, width - 10, height - 40);
        text(`Ammo: ${weapon.ammoInMagazine}/${weapon.magazineSize}`, width - 10, height - 10);
      }
    }
    
    this.drawCrosshair();
    
    drawingContext.enable(drawingContext.DEPTH_TEST);
    pop();
  }
  
  displayModernHUD(player) {
    camera();
    push();
    drawingContext.disable(drawingContext.DEPTH_TEST);
    
    translate(-width/2, -height/2);
    
    fill(0, 0, 0, 180);
    noStroke();
    rect(0, height - 60, width, 60);
    
    if (player.hasWeapon()) {
      let weapon = player.getCurrentWeapon();
      if (weapon) {
        fill(50, 50, 50, 150);
        rect(0, height - 60, width * 0.25, 60);
        
        textAlign(LEFT, CENTER);
        fill(255);
        textSize(18);
        text(`${weapon.name}`, 20, height - 40);
        
        textSize(22);
        fill(255, 255, 0);
        text(`${weapon.ammoInMagazine}/${weapon.magazineSize}`, 20, height - 15);
      }
    }
    
    let healthWidth = map(player.health, 0, player.maxHealth, 0, width * 0.25);
    let armorWidth = map(player.armor, 0, player.maxArmor, 0, width * 0.25);
    
    fill(50, 50, 50, 150);
    rect(width * 0.375, height - 60, width * 0.25, 60);
    
    textAlign(CENTER, TOP);
    fill(255);
    textSize(16);
    text("HEALTH", width * 0.5, height - 55);
   
    fill(100, 0, 0);
    rect(width * 0.4, height - 35, width * 0.2, 15);
    
    fill(255, 0, 0);
    rect(width * 0.4, height - 35, healthWidth, 15);
    
    fill(0, 40, 80);
    rect(width * 0.4, height - 15, width * 0.2, 10);
    
    fill(0, 100, 255);
    rect(width * 0.4, height - 15, armorWidth, 10);
    
    this.drawCrosshair();
    
    drawingContext.enable(drawingContext.DEPTH_TEST);
    pop();
  }
  
  drawCrosshair() {
    stroke(255);
    strokeWeight(1);
    fill(255);
    
    let crosshairSize = 10;
    let centerX = width / 2;
    let centerY = height / 2;
    
    line(centerX - crosshairSize, centerY, centerX + crosshairSize, centerY); 
    line(centerX, centerY - crosshairSize, centerX, centerY + crosshairSize); 
    noStroke();
    ellipse(centerX, centerY, 2, 2);
  }
  
  handleKeyPressed(key, keyCode) {
    if (key === ' ') {
      this.isPaused = !this.isPaused;
      
      if (!this.isPaused) {
        this.requestPointerLock();
        console.log("Game starting... Pointer lock requested");
      } else {
        if (document.pointerLockElement) {
          this.exitPointerLock();
        }
      }
      
      return false;
    }
    
    if (key === 'c' || key === 'C') {
      this.showControls = !this.showControls;
      
      if (this.showControls && this.pointerLocked) {
        this.exitPointerLock();
      }
    }
    
    if (key === 'h' || key === 'H') {
      this.hudType = (this.hudType + 1) % 2;
    }
    
    if (keyCode === ESCAPE) {
      this.isPaused = true;
      
      if (this.pointerLocked) {
        this.exitPointerLock();
      }
      
      return false;
    }
  }
  
  handleMousePressed() {
    if (this.isPaused) {
      if (!this.pointerLocked && mouseY > height/2 - 20 && mouseY < height/2 + 20) {
        this.isPaused = false;
        this.requestPointerLock();
      }
    }
  }
  
  requestPointerLock() {
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.requestPointerLock = canvas.requestPointerLock ||
                                    canvas.mozRequestPointerLock ||
                                    canvas.webkitRequestPointerLock;
        
        document.addEventListener('pointerlockchange', this.handlePointerLockChange.bind(this), false);
        document.addEventListener('mozpointerlockchange', this.handlePointerLockChange.bind(this), false);
        document.addEventListener('webkitpointerlockchange', this.handlePointerLockChange.bind(this), false);
        
        canvas.requestPointerLock();
        console.log("Requesting pointer lock on canvas");
      } else {
        console.error("Canvas element not found");
      }
    } catch (e) {
      console.error("Error requesting pointer lock:", e);
      this.pointerLocked = false;
      this.isPaused = false;
    }
  }
  
  handlePointerLockChange() {
    if (document.pointerLockElement) {
      console.log("Pointer is locked");
      this.pointerLocked = true;
      this.isPaused = false;
    } else {
      console.log("Pointer is unlocked");
      this.pointerLocked = false;
      
      if (!this.isPaused && !this.showControls) {
        this.isPaused = true;
      }
    }
  }
  
  exitPointerLock() {
    try {
      document.exitPointerLock = document.exitPointerLock ||
                                document.mozExitPointerLock ||
                                document.webkitExitPointerLock;
      document.exitPointerLock();
    } catch (e) {
      console.error("Error exiting pointer lock:", e);
    }
    this.pointerLocked = false;
  }
  
  playerDied() {
    this.playerDeaths++;
    console.log(`Player died (${this.playerDeaths} times)`);
  }
}
