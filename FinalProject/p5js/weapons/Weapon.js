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
    this.model = model
    this.modelScale = 4.0; // Changed from 1.0 to 4.0 to make models 4x bigger
    this.modelColor = color(200);

    // Animation properties
    this.recoilAmount = 0;
    this.maxRecoil = 15;
    this.recoilRecoveryRate = 0.8;

    this.bullets = [];
    this.reloadStartTime = 0;


  }

  update() {
    // Check if reload is complete
    if (this.isReloading) {
      if (millis() - this.lastFireTime >= this.reloadTime * 1000) {
        this.completeReload();
      }
    }
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      let bullet = this.bullets[i];


      bullet.pos.add(bullet.vel);


      if (millis() - bullet.spawnTime > bullet.lifeSpan) {
        this.bullets.splice(i, 1);  
      } else if (bullet.pos.x < -width / 2 || bullet.pos.x > width / 2 ||
                 bullet.pos.y < -height / 2 || bullet.pos.y > height / 2 ||
                 bullet.pos.z < -500 || bullet.pos.z > 500) {
        this.bullets.splice(i, 1);  
    }
    }
  }

  fire(position,direction) {
    // Can't fire if reloading or if not enough time has passed since last shot
    if (this.isReloading) return false;
    if (millis() - this.lastFireTime < 1000 / this.fireRate) return false;

    // Check if we have ammo
    if (this.ammoInMagazine <= 0) {
      this.reload();
      return false;
    }

    // Fire the weapon
    this.ammoInMagazine--;
    this.lastFireTime = millis();
    let spread = p5.Vector.random3D();
    spread.y = 0; // No spread on the Y axis (vertical direction)
    spread.mult((1 - this.accuracy) * 0.3);  // Adjust spread based on accuracy

    // Adjust the final direction with spread and normalize
    let finalDirection = p5.Vector.add(direction.copy(), spread).normalize();

    // Calculate velocity based on final direction
    let velocity = p5.Vector.mult(finalDirection, 10);  // 10 is bullet speed

    // Create bullet object
    const bullet = {
      pos: position.copy(),
      vel: velocity,
      size: 5,
      spawnTime: millis(),
      lifeSpan: 3000  // Bullet lifespan in milliseconds
    };

    this.bullets.push(bullet);
    let didHit = random() <= this.accuracy;  // Check if bullet hits target based on accuracy
  
    return didHit;
    
  }

  drawBullets() {
    for (let bullet of this.bullets) {
      push();
      translate(bullet.pos.x, bullet.pos.y, bullet.pos.z);
      fill(0, 200, 0);
      sphere(bullet.size);
      pop();
    }
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
      translate(width - this.displayX, height - this.displayY + this.recoilAmount, this.displayZ);

      rotateZ(PI);
      rotateY(PI / 4);
      rotateX(PI / 8);
      scale(this.modelScale);

      ambientLight(255,0,0);
      model(this.model);
    } else {
      fill(this.modelColor);
      translate(width / 4, height / 3, -50);
      box(20 * this.modelScale, 5 * this.modelScale, 40 * this.modelScale);
    }

    

    drawingContext.enable(drawingContext.DEPTH_TEST);
    pop();

    this.drawBullets();

  }
}