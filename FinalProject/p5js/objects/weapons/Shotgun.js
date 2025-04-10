class Shotgun extends Weapon {
  constructor(model) {
    // damage, fireRate, reloadTime, magazineSize, accuracy, model
    super("Shotgun", 8, 800, 2, 8, 0.7, model);

    // Set shotgun properties using parent class variables
    this.bulletsPerShot = 10;  // Multiple pellets per shot
//     this.spread = 0.15;        // Reasonable spread for shotgun
    this.bulletSpeed = 25;     // Faster pellets
    this.maxRecoil = 25;       // More recoil
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

    ambientLight(255, 0, 0);
    model(this.model);

    drawingContext.enable(drawingContext.DEPTH_TEST);
    pop();
  }

  fire(position, direction) {
    return super.fire(position, direction);
  }
}
