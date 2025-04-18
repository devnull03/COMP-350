class Weapon {
  constructor(name, damage, fireRate, reloadTime, magazineSize, accuracy, model) {
    this.name = name;
    this.damage = damage;
    this.fireRate = fireRate;
    this.reloadTime = reloadTime;
    this.magazineSize = magazineSize;
    this.accuracy = accuracy;

    this.ammoInMagazine = magazineSize;
    this.isReloading = false;
    this.lastFireTime = 0;

    this.displayX = 200;
    this.displayY = 160;
    this.displayZ = -150;

    this.model = model;
    this.modelScale = 4.0;

    this.materialColor = color(200, 200, 200);
    this.specularColor = color(255, 255, 255);
    this.shininessValue = 30;
    this.ambientColor = color(50, 50, 50);

    this.isMetallic = true;

    this.recoilAmount = 0;
    this.maxRecoil = 15;
    this.recoilRecoveryRate = 0.8;

    this.bullets = [];
    this.reloadStartTime = 0;

    this.bulletsPerShot = 1;
    this.spread = 0;
    this.bulletSpeed = 10;

    if (this.model) {
      this.model.materialColor = this.materialColor;
    }
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
      
      this.createBullet(position, bulletDirection);
    }
    
    this.ammoInMagazine--;
    this.lastFireTime = millis();
  }

  createBullet(position, direction) {
    const bullet = {
      position: position.copy(),
      velocity: p5.Vector.mult(direction, this.bulletSpeed),
      damage: this.damage,
      size: 3,
      lifetime: 2000,
      birthTime: millis()
    };
    
    this.bullets.push(bullet);
    return bullet;
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

    this.isReloading = true;
    this.reloadStartTime = millis();
    
    setTimeout(() => {
      this.completeReload();
    }, this.reloadTime * 1000);
  }

  completeReload() {
    if (!this.isReloading) return;
    
    this.ammoInMagazine = this.magazineSize;
    this.isReloading = false;
  }

  addAmmo(amount) {
    return;
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
      
      directionalLight(200, 200, 200, 0, 0, -1);
      pointLight(255, 255, 255, 0, -50, 100);
      
      noStroke();
      ambientMaterial(this.ambientColor);
      fill(this.materialColor);
      
      if (this.isMetallic) {
        specularMaterial(this.specularColor);
        shininess(this.shininessValue);
      } else {
        normalMaterial();
      }
      
      model(this.model);
      
      if (millis() - this.lastFireTime < 100) {
        push();
        translate(0, 0, 20);
        emissiveMaterial(255, 200, 50);
        sphere(2);
        pointLight(255, 200, 50, 0, 0, 25);
        pop();
      }
    } else {
      fill(this.materialColor);
      specularMaterial(this.specularColor);
      shininess(this.shininessValue);
      translate(width / 4, height / 3, -50);
      box(20 * this.modelScale, 5 * this.modelScale, 40 * this.modelScale);
    }

    drawingContext.enable(drawingContext.DEPTH_TEST);
    pop();
  }
}