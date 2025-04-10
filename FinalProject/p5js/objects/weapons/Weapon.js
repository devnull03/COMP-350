class Weapon {
  constructor(name, damage, fireRate, reloadTime, magazineSize, accuracy, model) {
    this.name = name;
    this.damage = damage;
    this.fireRate = fireRate; // Shots per second
    this.reloadTime = reloadTime; // Seconds
    this.magazineSize = magazineSize;
    this.accuracy = accuracy; // 0-1, 1 being perfect

    // Current state
    this.ammoInMagazine = magazineSize;
    this.totalAmmo = magazineSize * 3; // Start with 3 extra magazines
    this.isReloading = false;
    this.lastFireTime = 0;

    this.displayX = 200;
    this.displayY = 160;
    this.displayZ = -150;

    // Visual properties
    this.model = model;
    this.modelScale = 4.0; // Changed from 1.0 to 4.0 to make models 4x bigger
    this.modelColor = color(200);

    // Animation properties
    this.recoilAmount = 0;
    this.maxRecoil = 15;
    this.recoilRecoveryRate = 0.8;

    this.bullets = [];
    this.reloadStartTime = 0;

    this.bulletsPerShot = 1; // Default to one bullet per shot
    this.spread = 0; // Default spread angle
    this.bulletSpeed = 10; // Default bullet speed
  }

  update() {
    // Update all bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      let bullet = this.bullets[i];
      
      // Check if the bullet is valid
      if (!bullet) {
        this.bullets.splice(i, 1);
        continue;
      }
      
      // Make sure bullet has position property
      if (!bullet.position) {
        console.warn("Bullet has no position property");
        this.bullets.splice(i, 1);
        continue;
      }
      
      // Update bullet position with its velocity
      bullet.position.add(bullet.velocity);
      
      // Check if the bullet has expired (based on lifetime)
      if (millis() - bullet.birthTime > bullet.lifetime) {
        this.bullets.splice(i, 1);
      }
    }
  }

  fire(position, direction) {
    // Make sure both position and direction are defined
    if (!position || !direction) {
      console.warn("Weapon.fire: position or direction is undefined");
      return;
    }

    // Check if we can fire (ammo, cooldown, etc.)
    if (this.ammoInMagazine <= 0) {
      // Out of ammo, try to reload
      this.reload();
      return;
    }

    if (millis() - this.lastFireTime < this.fireRate) {
      // Can't fire yet, still on cooldown
      return;
    }

    // Create a new bullet
    for (let i = 0; i < this.bulletsPerShot; i++) {
      // Apply spread if needed
      let bulletDirection = direction.copy();
      if (this.spread > 0) {
        // Apply random spread within the specified angle
        let spreadAmount = random(-this.spread, this.spread);
        // Create a rotation matrix and apply it to the direction
        let rotationAxis = createVector(-direction.z, 0, direction.x).normalize();
        bulletDirection = this.rotateVector(bulletDirection, rotationAxis, spreadAmount);
        
        // Add some random horizontal spread too
        let horizontalAxis = createVector(0, 1, 0);
        bulletDirection = this.rotateVector(bulletDirection, horizontalAxis, random(-this.spread, this.spread));
      }
      
      // Create the bullet with the position and direction
      const bullet = {
        position: position.copy(), // Using position consistently
        velocity: p5.Vector.mult(bulletDirection, this.bulletSpeed),
        damage: this.damage,
        size: 3,
        lifetime: 2000, // milliseconds
        birthTime: millis()
      };
      
      this.bullets.push(bullet);
    }
    
    // Reduce ammo
    this.ammoInMagazine--;
    
    // Update last fire time
    this.lastFireTime = millis();
  }

  // Helper method to rotate a vector around an axis by a given angle
  rotateVector(vector, axis, angle) {
    // Convert angle from degrees to radians if needed
    const radians = typeof angle === "number" ? angle * (PI / 180) : angle;

    // Use p5.Vector's rotate method if it exists, otherwise implement Rodrigues' rotation formula
    if (typeof vector.rotate === "function") {
      return vector.rotate(radians, axis);
    } else {
      // Rodrigues' rotation formula
      const cosTheta = cos(radians);
      const sinTheta = sin(radians);

      const dot = vector.dot(axis);
      const cross = p5.Vector.cross(axis, vector);

      const result = vector.copy();
      result.mult(cosTheta);

      const term2 = p5.Vector.mult(axis, dot * (1 - cosTheta));
      const term3 = p5.Vector.mult(cross, sinTheta);

      result.add(term2);
      result.add(term3);

      return result;
    }
  }

  drawBullets() {
    push();
    noStroke();
    fill(255, 255, 0); // Yellow bullets
    
    for (let bullet of this.bullets) {
      if (bullet && bullet.position) {
        push();
        translate(bullet.position.x, bullet.position.y, bullet.position.z);
        sphere(bullet.size || 3);
        pop();
      }
    }
    
    pop();
  }

  reload() {
    if (this.isReloading) return;
    if (this.ammoInMagazine >= this.magazineSize) return;
    if (this.totalAmmo <= 0) return;

    this.isReloading = true;
    this.reloadStartTime = millis();
  }

  completeReload() {
    const ammoNeeded = this.magazineSize - this.ammoInMagazine;
    const ammoToLoad = min(ammoNeeded, this.totalAmmo);

    this.ammoInMagazine += ammoToLoad;
    this.totalAmmo -= ammoToLoad;
    this.isReloading = false;
  }

  addAmmo(amount) {
    this.totalAmmo += amount;
  }

  display() {
    push();
    drawingContext.disable(drawingContext.DEPTH_TEST);

    // Move to 2D rendering coordinates
    translate(-width / 2, -height / 2, 0);

    // Calculate recoil animation
    if (millis() - this.lastFireTime < 150) {
      // Apply recoil
      this.recoilAmount = this.maxRecoil;
    } else if (this.recoilAmount > 0) {
      // Recover from recoil
      this.recoilAmount *= this.recoilRecoveryRate;
      if (this.recoilAmount < 0.1) this.recoilAmount = 0;
    }

    if (this.model) {
      translate(
        width - this.displayX,
        height - this.displayY + this.recoilAmount,
        this.displayZ
      );

      rotateZ(PI);
      rotateY(PI / 4);
      rotateX(PI / 8);
      scale(this.modelScale);

      ambientLight(255, 0, 0);
      model(this.model);
    } else {
      fill(this.modelColor);
      translate(width / 4, height / 3, -50);
      box(20 * this.modelScale, 5 * this.modelScale, 40 * this.modelScale);
    }

    drawingContext.enable(drawingContext.DEPTH_TEST);
    pop();

    // this.drawBullets();
  }
}