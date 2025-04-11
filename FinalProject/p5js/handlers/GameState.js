class GameState {
  constructor() {
    this.isPaused = true;
    this.showControls = false;
    this.pointerLocked = false;

    this.playerDeaths = 0;
    this.gameStartTime = 0;
    this.gameTime = 0;

    this.hudType = 0;
    // New flags
    this.gameStarted = false;
    this.isGameOver = false;
  }

  displayMainMenu(isPaused) {
    camera();
    push();

    translate(-width / 2, -height / 2, 0);

    fill(0, 0, 0, 200);
    noStroke();
    rect(0, 0, width, height);

    textSize(40);
    textAlign(CENTER, CENTER);
    fill(255, 50, 50);
    text(this.isGameOver ? "YOU DIED" : "3D DOOM GAME", width / 2, height / 4);

    fill(100, 100, 100);
    stroke(255);
    strokeWeight(2);
    rect(width / 2 - 100, height / 2 - 20, 200, 40, 5);

    noStroke();
    fill(255, 255, 0);
    textAlign(CENTER, CENTER);
    textSize(24);
    text(`${this.isPaused && this.gameStarted ? 'RESUME' : 'START'} GAME`, width / 2, height / 2);

    fill(100, 100, 100);
    stroke(255);
    strokeWeight(2);
    rect(width / 2 - 100, height / 2 + 40, 200, 40, 5);

    noStroke();
    fill(255, 255, 0);
    textSize(18);
    text("CONTROLS", width / 2, height / 2 + 60);

    if (this.isGameOver) {
      fill(255);
      textSize(16);
      text("Deaths: " + this.playerDeaths, width / 2, height / 2 + 60);
    }

    pop();
  }

  displayControls() {
    camera();
    push();

    translate(-width / 2, -height / 2, 0);
    
    // Dark semi-transparent background
    fill(0, 0, 0, 220);
    noStroke();
    rect(0, 0, width, height);

    // Title
    textSize(40);
    textAlign(CENTER, CENTER);
    fill(255, 100, 100);
    text("GAME CONTROLS", width / 2, height * 0.15);

    // Section - Movement
    fill(200, 200, 255);
    textSize(22);
    text("MOVEMENT", width / 4, height * 0.25);
    
    fill(255);
    textSize(16);
    textAlign(LEFT);
    let leftColumnX = width * 0.1;
    let startY = height * 0.3;
    let lineSpacing = 25;
    
    text("W / S:", leftColumnX, startY);
    text("Move forward / backward", leftColumnX + 80, startY);
    
    text("A / D:", leftColumnX, startY + lineSpacing);
    text("Move left / right", leftColumnX + 80, startY + lineSpacing);
    
    text("Mouse:", leftColumnX, startY + lineSpacing * 2);
    text("Look around", leftColumnX + 80, startY + lineSpacing * 2);

    // Section - Combat
    fill(255, 200, 200);
    textSize(22);
    textAlign(CENTER);
    text("COMBAT", width / 4, height * 0.5);
    
    fill(255);
    textSize(16);
    textAlign(LEFT);
    startY = height * 0.55;
    
    text("Mouse Click:", leftColumnX, startY);
    text("Fire weapon", leftColumnX + 120, startY);
    
    text("R:", leftColumnX, startY + lineSpacing);
    text("Reload weapon", leftColumnX + 120, startY + lineSpacing);
    
    text("1, 2, 3:", leftColumnX, startY + lineSpacing * 2);
    text("Switch to weapon slot", leftColumnX + 120, startY + lineSpacing * 2);
    
    text("Q / E:", leftColumnX, startY + lineSpacing * 3);
    text("Previous / Next weapon", leftColumnX + 120, startY + lineSpacing * 3);
    
    // Section - Game Controls
    fill(200, 255, 200);
    textSize(22);
    textAlign(CENTER);
    text("GAME CONTROLS", width * 0.75, height * 0.25);
    
    fill(255);
    textSize(16);
    textAlign(LEFT);
    let rightColumnX = width * 0.6;
    startY = height * 0.3;
    
    text("ESC:", rightColumnX, startY);
    text("Pause game", rightColumnX + 80, startY);
    
    text("Space:", rightColumnX, startY + lineSpacing);
    text("Start/Pause game", rightColumnX + 80, startY + lineSpacing);
    
    text("C:", rightColumnX, startY + lineSpacing * 2);
    text("Toggle controls view", rightColumnX + 80, startY + lineSpacing * 2);
    
    text("H:", rightColumnX, startY + lineSpacing * 3);
    text("Change HUD style", rightColumnX + 80, startY + lineSpacing * 3);
    
    text("L:", rightColumnX, startY + lineSpacing * 4);
    text("Toggle lighting modes", rightColumnX + 80, startY + lineSpacing * 4);

    // Return button
    fill(100, 100, 100);
    stroke(255);
    strokeWeight(2);
    rect(width / 2 - 100, height * 0.85, 200, 40, 5);
    
    noStroke();
    fill(255, 255, 0);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("RETURN TO GAME", width / 2, height * 0.85 + 20);

    pop();
  }

  displayHUD(player) {
    if (this.isPaused || this.showControls) return;

    if (this.hudType === 0) {
      this.displayModernHUD(player);
    } else {
      this.displayBottonHUD(player);
    }
  }

  displayModernHUD(player) {
    camera();
    push();
    drawingContext.disable(drawingContext.DEPTH_TEST);

    translate(-width / 2, -height / 2);

    this.drawCoordinateRadar(player);
    this.drawStatusBars(player);
    this.drawWeaponIndicator(player);
    this.drawCrosshair();

    drawingContext.enable(drawingContext.DEPTH_TEST);
    pop();
  }
  
  drawCoordinateRadar(player) {
    fill(0, 0, 0, 180);
    stroke(255, 100, 100);
    strokeWeight(2);
    ellipse(80, 80, 130, 130);
    
    noStroke();
    fill(20, 20, 20, 200);
    ellipse(80, 80, 120, 120);
    
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(14);
    text("LOCATION", 80, 35);
    
    textSize(12);
    fill(255, 100, 100);
    text(`X: ${player.pos.x.toFixed(0)}`, 80, 60);
    fill(100, 255, 100);
    text(`Y: ${player.pos.y.toFixed(0)}`, 80, 80);
    fill(100, 100, 255);
    text(`Z: ${player.pos.z.toFixed(0)}`, 80, 100);
    
    stroke(255, 200, 0);
    strokeWeight(2);
    let angle = player.yaw;
    line(80, 80, 80 + cos(angle) * 45, 80 + sin(angle) * 45);
    noStroke();
    fill(255, 200, 0);
    ellipse(80 + cos(angle) * 45, 80 + sin(angle) * 45, 8, 8);
    
    let radarAngle = (frameCount * 0.02) % TWO_PI;
    stroke(0, 255, 0, 100);
    strokeWeight(1);
    line(80, 80, 80 + cos(radarAngle) * 60, 80 + sin(radarAngle) * 60);
    
    noFill();
    stroke(0, 255, 0, 60);
    strokeWeight(1);
    ellipse(80, 80, 80, 80);
    ellipse(80, 80, 40, 40);
  }
  
  drawStatusBars(player) {
    noStroke();
    fill(40, 40, 40, 200);
    
    beginShape();
    vertex(10, height - 90);
    vertex(250, height - 100);
    vertex(250, height - 70);
    vertex(10, height - 60);
    endShape(CLOSE);
    
    let healthPercent = player.health / player.maxHealth;
    if (healthPercent > 0.7) fill(0, 230, 0);
    else if (healthPercent > 0.3) fill(230, 230, 0);
    else fill(230, 0, 0);
    
    beginShape();
    vertex(15, height - 85);
    vertex(15 + 230 * healthPercent, height - (85 + 10 * healthPercent));
    vertex(15 + 230 * healthPercent, height - (65 + 5 * healthPercent));
    vertex(15, height - 65);
    endShape(CLOSE);
    
    // Health text with glow effect
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(16);
    textStyle(BOLD);
    text(`HEALTH: ${player.health}`, 25, height - 75);
    textStyle(NORMAL);
    
    fill(40, 40, 40, 200);
    beginShape();
    vertex(10, height - 50);
    vertex(200, height - 55);
    vertex(200, height - 25);
    vertex(10, height - 20);
    endShape(CLOSE);
    
    let armorPercent = player.armor / player.maxArmor;
    fill(30, 144, 255);
    beginShape();
    vertex(15, height - 45);
    vertex(15 + 180 * armorPercent, height - (45 + 5 * armorPercent));
    vertex(15 + 180 * armorPercent, height - (30 + 2.5 * armorPercent));
    vertex(15, height - 30);
    endShape(CLOSE);
    
    fill(255);
    textSize(16);
    textStyle(BOLD);
    text(`ARMOR: ${player.armor}`, 25, height - 35);
    textStyle(NORMAL);
  }
  
  drawWeaponIndicator(player) {
    if (player.hasWeapon()) {
      let weapon = player.getCurrentWeapon();
      if (weapon) {
        stroke(255, 200, 0);
        strokeWeight(2);
        fill(40, 40, 40, 200);
        rect(width - 220, 20, 200, 60, 10);
        
        // Weapon name
        noStroke();
        fill(255, 200, 0);
        textAlign(CENTER, TOP);
        textSize(20);
        textStyle(BOLD);
        text(weapon.name, width - 120, 25);
        textStyle(NORMAL);
        
        // Ammo display
        stroke(255);
        strokeWeight(1);
        fill(0);
        rect(width - 180, 55, 120, 15);
        
        // Ammo bar
        let ammoPercent = weapon.ammoInMagazine / weapon.magazineSize;
        noStroke();
        fill(255, 200, 0);
        rect(width - 178, 57, 116 * ammoPercent, 11);
        
        // Ammo text
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(`${weapon.ammoInMagazine}/${weapon.magazineSize}`, width - 120, 62);
        
        // Weapon selector indicators
        let weaponSlotY = 100;
        let slotWidth = 40;
        let slotGap = 10;
        
        for (let i = 0; i < player.weapons.length; i++) {
          let slotX = width - 220 + i * (slotWidth + slotGap);
          
          strokeWeight(2);
          if (i === player.currentWeaponIndex) {
            stroke(255, 200, 0);
            fill(60, 60, 60, 220);
          } else {
            stroke(150);
            fill(40, 40, 40, 180);
          }
          
          rect(slotX, weaponSlotY, slotWidth, slotWidth, 5);
          
          // Slot number
          noStroke();
          if (i === player.currentWeaponIndex) {
            fill(255, 200, 0);
          } else {
            fill(200);
          }
          textAlign(LEFT, TOP);
          textSize(12);
          text(`${i+1}`, slotX + 5, weaponSlotY + 5);
          
          // Weapon icon or letter
          textAlign(CENTER, CENTER);
          textSize(16);
          let shortName = player.weapons[i].name.charAt(0);
          text(shortName, slotX + slotWidth/2, weaponSlotY + slotWidth/2 + 2);
        }
      }
    }
  }

  displayBottonHUD(player) {
    camera();
    push();
    drawingContext.disable(drawingContext.DEPTH_TEST);

    translate(-width / 2, -height / 2);
    
    // Main HUD background panel
    fill(0, 0, 0, 180);
    noStroke();
    rect(0, height - 100, width, 100);
    
    // Add a stylish top edge with highlight
    fill(60, 60, 70, 200);
    beginShape();
    vertex(0, height - 100);
    vertex(width, height - 100);
    vertex(width, height - 95);
    vertex(0, height - 90);
    endShape(CLOSE);
    
    stroke(255, 100, 100);
    strokeWeight(1);
    line(0, height - 98, width, height - 98);
    noStroke();
    
    // ===== LEFT SIDE: HEALTH AND ARMOR =====
    // Health bar with slanted design
    fill(40, 40, 40, 200);
    let healthBarWidth = width * 0.25;
    
    beginShape();
    vertex(20, height - 80);
    vertex(20 + healthBarWidth, height - 85);
    vertex(20 + healthBarWidth, height - 60);
    vertex(20, height - 55); 
    endShape(CLOSE);
    
    // Health fill
    let healthPercent = player.health / player.maxHealth;
    if (healthPercent > 0.7) fill(0, 230, 0);
    else if (healthPercent > 0.3) fill(230, 230, 0);
    else fill(230, 0, 0);
    
    beginShape();
    vertex(25, height - 75);
    vertex(25 + healthBarWidth * healthPercent - 10, height - 80);
    vertex(25 + healthBarWidth * healthPercent - 10, height - 65);
    vertex(25, height - 60);
    endShape(CLOSE);
    
    // Health text
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(16);
    textStyle(BOLD);
    text(`HEALTH: ${player.health}`, 35, height - 70);
    
    // Armor bar with slanted design
    fill(40, 40, 40, 200);
    let armorBarWidth = width * 0.2;
    
    beginShape();
    vertex(20, height - 45);
    vertex(20 + armorBarWidth, height - 50);
    vertex(20 + armorBarWidth, height - 25);
    vertex(20, height - 20);
    endShape(CLOSE);
    
    // Armor fill
    let armorPercent = player.armor / player.maxArmor;
    fill(30, 144, 255);
    
    beginShape();
    vertex(25, height - 40);
    vertex(25 + armorBarWidth * armorPercent - 10, height - 45);
    vertex(25 + armorBarWidth * armorPercent - 10, height - 30);
    vertex(25, height - 25);
    endShape(CLOSE);
    
    // Armor text
    fill(255);
    textSize(16);
    text(`ARMOR: ${player.armor}`, 35, height - 35);
    textStyle(NORMAL);
    
    // ===== CENTER: WEAPON SLOTS =====
    if (player.hasWeapon() && player.weapons.length > 0) {
      let centerX = width / 2;
      let slotWidth = 60;
      let slotHeight = 40;
      let totalWidth = player.weapons.length * slotWidth + (player.weapons.length - 1) * 10;
      let startX = centerX - totalWidth / 2;
      
      for (let i = 0; i < player.weapons.length; i++) {
        let slotX = startX + i * (slotWidth + 10);
        
        // Weapon slot background
        if (i === player.currentWeaponIndex) {
          fill(70, 70, 80, 220);
          stroke(255, 200, 0);
          strokeWeight(2);
        } else {
          fill(50, 50, 60, 180);
          stroke(150);
          strokeWeight(1);
        }
        
        rect(slotX, height - 70, slotWidth, slotHeight, 5);
        
        // Weapon slot number
        noStroke();
        fill(i === player.currentWeaponIndex ? 255 : 180);
        textAlign(CENTER, CENTER);
        textSize(22);
        text(`${i+1}`, slotX + slotWidth/2, height - 50);
        
        // Weapon icon or first letter
        textSize(14);
        let shortName = player.weapons[i].name.split(' ')[0];
        text(shortName, slotX + slotWidth/2, height - 30);
      }
    }
    
    // ===== RIGHT SIDE: WEAPON & AMMO =====
    if (player.hasWeapon()) {
      let weapon = player.getCurrentWeapon();
      if (weapon) {
        let rightPanelX = width - 280;
        
        // Weapon panel background
        fill(40, 40, 50, 200);
        stroke(255, 200, 0);
        strokeWeight(2);
        rect(rightPanelX, height - 85, 260, 70, 8);
        noStroke();
        
        // Weapon name
        fill(255, 200, 0);
        textAlign(LEFT, TOP);
        textSize(20);
        textStyle(BOLD);
        text(weapon.name, rightPanelX + 15, height - 80);
        textStyle(NORMAL);
        
        // Ammo display
        // Ammo background
        fill(30, 30, 40);
        rect(rightPanelX + 15, height - 50, 150, 25, 4);
        
        // Ammo bar
        let ammoPercent = weapon.ammoInMagazine / weapon.magazineSize;
        if (ammoPercent > 0.7) fill(0, 230, 0);
        else if (ammoPercent > 0.3) fill(230, 230, 0);
        else fill(230, 0, 0);
        
        rect(rightPanelX + 17, height - 48, 146 * ammoPercent, 21, 3);
        
        // Ammo text
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text(`${weapon.ammoInMagazine} / ${weapon.magazineSize}`, rightPanelX + 90, height - 38);
        
        // Reload indicator
        if (weapon.isReloading) {
          fill(255, 50, 50);
          textAlign(RIGHT, CENTER);
          text("RELOADING", rightPanelX + 245, height - 38);
          
          // Reload progress bar
          let reloadProgress = (millis() - weapon.reloadStartTime) / (weapon.reloadTime * 1000);
          reloadProgress = constrain(reloadProgress, 0, 1);
          
          fill(40, 40, 50);
          rect(rightPanelX + 180, height - 80, 65, 8, 2);
          
          fill(255, 200, 0);
          rect(rightPanelX + 180, height - 80, 65 * reloadProgress, 8, 2);
        } else {
          // Fire mode/status when not reloading
          fill(200, 200, 200);
          textAlign(RIGHT, TOP);
          textSize(14);
          text("READY", rightPanelX + 245, height - 80);
        }
      }
    }
    
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
    const inRect = (x, y, w, h) => mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;

    if (!this.gameStarted && !this.isGameOver) {
      // Main Menu buttons
      // Start Game button
      if (inRect(width / 2 - 100, height / 2 - 20, 200, 40)) {
        this.gameStarted = true;
        this.isPaused = false;
        this.requestPointerLock();
      }
      // Controls button toggles controls view
      else if (inRect(width / 2 - 100, height / 2 + 40, 200, 40)) {
        this.showControls = !this.showControls;
      }
    } else if (this.gameStarted && this.isPaused && !this.isGameOver) {
      // Pause Menu: Resume button
      if (inRect(width / 2 - 100, height / 2 - 20, 200, 40)) {
        this.isPaused = false;
        this.requestPointerLock();
      }
    } else if (this.isGameOver) {
      // Death Screen: Restart button
      if (inRect(width / 2 - 100, height / 2 - 20, 200, 40)) {
        this.isGameOver = false;
        this.gameStarted = false;
        this.isPaused = true;
        this.playerDeaths = 0;
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
