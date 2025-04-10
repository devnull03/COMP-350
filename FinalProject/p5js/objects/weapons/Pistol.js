class Pistol extends Weapon {
  constructor() {
    // name, damage, fireRate, reloadTime, magazineSize, accuracy
    super("Pistol", 15, 300, 1.5, 10, 0.8);

    this.modelColor = color(50, 50, 50);
    this.modelScale = 0.8;
    
    this.displayX = 200;
    this.displayY = 160;
    this.displayZ = -150;
    this.weaponScale = 5;
    
    this.bulletsPerShot = 1;
    this.spread = 0.05;
    this.bulletSpeed = 20;
  }

  display() {
    camera();
    push(); 
    drawingContext.disable(drawingContext.DEPTH_TEST);
    
    translate(-width/2, -height/2, 0);
    
    if (millis() - this.lastFireTime < 150) {
      this.recoilAmount = this.maxRecoil;
    } else if (this.recoilAmount > 0) {
      this.recoilAmount *= this.recoilRecoveryRate;
      if (this.recoilAmount < 0.1) this.recoilAmount = 0;
    }
    
    push();
    translate(width - this.displayX, height - this.displayY + this.recoilAmount, this.displayZ);
    rotateY(PI/6);
    rotateX(PI/20);
    scale(this.weaponScale);
    
    fill(40);
    stroke(20);
    strokeWeight(0.3);
    
    push();
    translate(0, -2, 10);
    box(14, 6, 40);
    
    fill(20);
    translate(0, -3.1, -5);
    box(10, 0.5, 15);
    
    translate(0, 0, 25);
    box(2, 1, 1);
    pop();
    
    fill(30);
    push();
    translate(0, 4, 5);
    box(12, 10, 30);
    
    translate(0, 8, 3);
    rotateX(PI/2);
    fill(20);
    torus(5, 1.5, 20, 8);
    
    fill(70);
    translate(0, 0, 2);
    box(2, 1, 4);
    pop();
    
    push();
    fill(45);
    translate(0, 12, 0);
    
    box(10, 24, 14);
    
    fill(35);
    for (let y = -8; y <= 8; y += 4) {
      for (let z = -4; z <= 4; z += 4) {
        push();
        translate(5.2, y, z);
        box(0.5, 2, 2);
        translate(-10.4, 0, 0);
        box(0.5, 2, 2);
        pop();
      }
    }
    
    fill(50);
    translate(0, 13, 0);
    box(9.5, 2, 13.5);
    pop();
    
    push();
    fill(20);
    translate(0, -2, 25);
    cylinder(2.5, 15);
    
    fill(10);
    translate(0, 0, 7.5);
    cylinder(3, 2);
    pop();
    
    push();
    fill(30);
    translate(0, -5, -8);
    rotateX(-PI/4);
    box(4, 2, 6);
    pop();
    
    pop();
    
    drawingContext.enable(drawingContext.DEPTH_TEST);
    pop();
  }

  fire(position, direction) {
    if (this.isReloading || millis() - this.lastFireTime < this.fireRate) {
      return false;
    }

    if (this.ammoInMagazine <= 0) {
      this.reload();
      return false;
    }

    const bulletPosition = position.copy(); 
    super.fire(bulletPosition, direction);
    
    this.lastFireTime = millis();
    return true;
  }
  
  cylinder(radius, height) {
    const resolution = 24;
    
    push();
    translate(0, 0, height/2);
    beginShape();
    for (let i = 0; i < resolution; i++) {
      const angle = TWO_PI * i / resolution;
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    pop();
    
    push();
    translate(0, 0, -height/2);
    beginShape();
    for (let i = 0; i < resolution; i++) {
      const angle = TWO_PI * i / resolution;
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    pop();
    
    for (let i = 0; i < resolution; i++) {
      const angle1 = TWO_PI * i / resolution;
      const angle2 = TWO_PI * (i+1) / resolution;
      
      const x1 = cos(angle1) * radius;
      const y1 = sin(angle1) * radius;
      const x2 = cos(angle2) * radius;
      const y2 = sin(angle2) * radius;
      
      beginShape();
      vertex(x1, y1, height/2);
      vertex(x2, y2, height/2);
      vertex(x2, y2, -height/2);
      vertex(x1, y1, -height/2);
      endShape(CLOSE);
    }
  }
}
