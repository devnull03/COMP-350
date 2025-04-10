class Weapon {
  constructor(name, damage, fireRate, reloadTime, magazineSize, accuracy, model) {
    this.name = name;
    this.damage = damage;
    this.fireRate = fireRate;
    this.reloadTime = reloadTime;
    this.magazineSize = magazineSize;
    this.accuracy = accuracy;

    this.ammoInMagazine = magazineSize;
    this.totalAmmo = magazineSize * 3;
    this.isReloading = false;
    this.lastFireTime = 0;

    this.displayX = 200;
    this.displayY = 160;
    this.displayZ = -150;

    this.model = model;
    this.modelScale = 4.0;
    this.modelColor = color(200);

    this.recoilAmount = 0;
    this.maxRecoil = 15;
    this.recoilRecoveryRate = 0.8;

    this.bullets = [];
    this.reloadStartTime = 0;

    this.bulletsPerShot = 1;
    this.spread = 0;
    this.bulletSpeed = 10;
  }

  update() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      let bullet = this.bullets[i];
      
      if (!bullet) {
        this.bullets.splice(i, 1);
        continue;
      }
      
      if (!bullet.position) {
        this.bullets.splice(i, 1);
        continue;
      }
      
      bullet.position.add(bullet.velocity);
      
      if (millis() - bullet.birthTime > bullet.lifetime) {
        this.bullets.splice(i, 1);
      }
    }
  }

  fire(position, direction) {
    if (!position || !direction) {
      return;
    }

    if (this.ammoInMagazine <= 0) {
      this.reload();
      return;
    }

    if (millis() - this.lastFireTime < this.fireRate) {
      return;
    }

    for (let i = 0; i < this.bulletsPerShot; i++) {
      let bulletDirection = direction.copy();
      if (this.spread > 0) {
        let spreadAmount = random(-this.spread, this.spread);
        let rotationAxis = createVector(-direction.z, 0, direction.x).normalize();
        bulletDirection = this.rotateVector(bulletDirection, rotationAxis, spreadAmount);
        
        let horizontalAxis = createVector(0, 1, 0);
        bulletDirection = this.rotateVector(bulletDirection, horizontalAxis, random(-this.spread, this.spread));
      }
      
      const bullet = {
        position: position.copy(),
        velocity: p5.Vector.mult(bulletDirection, this.bulletSpeed),
        damage: this.damage,
        size: 3,
        lifetime: 2000,
        birthTime: millis()
      };
      
      this.bullets.push(bullet);
    }
    
    this.ammoInMagazine--;
    this.lastFireTime = millis();
  }

  rotateVector(vector, axis, angle) {
    const radians = typeof angle === "number" ? angle * (PI / 180) : angle;

    if (typeof vector.rotate === "function") {
      return vector.rotate(radians, axis);
    } else {
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
    fill(255, 255, 0);
    
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

    translate(-width / 2, -height / 2, 0);

    if (millis() - this.lastFireTime < 150) {
      this.recoilAmount = this.maxRecoil;
    } else if (this.recoilAmount > 0) {
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
  }
}