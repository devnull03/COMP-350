class Shotgun extends Weapon {
  constructor(model) {
    // damage, fireRate, reloadTime, magazineSize, accuracy, model
    super("Shotgun", 8, 800, 2, 8, 0.7, model);

    this.bulletsPerShot = 10; 
    this.bulletSpeed = 25;
    this.maxRecoil = 25;
    
    this.materialColor = color(120, 100, 80); 
    this.specularColor = color(180, 160, 140);
    this.shininessValue = 20;
    this.ambientColor = color(60, 50, 40);
    
    this.displayX = 180;
    this.displayY = 170;
    this.displayZ = -140;
    
    if (this.model) {
      this.model.materialColor = this.materialColor;
    }
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

    translate(width - this.displayX, height - this.displayY + this.recoilAmount, this.displayZ);

    rotateZ(-PI);
    rotateY(PI-12);
    rotateX(PI / 8);
    scale(this.modelScale);

    directionalLight(180, 180, 180, 0, 0, -1);
    pointLight(255, 255, 255, 0, -50, 100);
    
    noStroke();
    ambientMaterial(this.ambientColor);
    fill(this.materialColor);
    specularMaterial(this.specularColor);
    shininess(this.shininessValue);
    
    model(this.model);
    
    if (millis() - this.lastFireTime < 300) {
      push();
      translate(0, 0, 15);
      ambientMaterial(200, 200, 200, 150);
      sphere(this.recoilAmount / 10);
      pop();
    }

    drawingContext.enable(drawingContext.DEPTH_TEST);
    pop();
  }

  fire(position, direction) {
    return super.fire(position, direction);
  }
}
