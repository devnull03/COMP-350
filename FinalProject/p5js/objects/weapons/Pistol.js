class Pistol extends Weapon {
  constructor() {
    // name, damage, fireRate, reloadTime, magazineSize, accuracy
    super("Pistol", 15, 2, 1.5, 10, 0.8);

    // Custom properties for pistol
    this.modelColor = color(50, 50, 50);
    this.modelScale = 0.8;
    
    // Position variables for weapon display
    this.displayX = 200;
    this.displayY = 160;
    this.displayZ = -150;
    this.weaponScale = 5;
    this.barrelLength = 50;
    
    // Animation properties
    this.recoilAmount = 0;
    this.maxRecoil = 15;
    this.recoilRecoveryRate = 0.8;
    this.lastFireTime = 0;
  }

  display() {
    // Draw pistol model in HUD style
    camera();
    push(); 
    // Disable depth test to ensure weapon is drawn on top
    drawingContext.disable(drawingContext.DEPTH_TEST);
    
    // Move to 2D rendering coordinates
    translate(-width/2, -height/2, 0);
    
    // Calculate recoil animation
    if (millis() - this.lastFireTime < 150) {
      // Apply recoil
      this.recoilAmount = this.maxRecoil;
    } else if (this.recoilAmount > 0) {
      // Recover from recoil
      this.recoilAmount *= this.recoilRecoveryRate;
      if (this.recoilAmount < 0.1) this.recoilAmount = 0;
    }
    
    push();
    // Position at bottom right corner of screen with recoil offset
    translate(width - this.displayX, height - this.displayY + this.recoilAmount, this.displayZ);
    rotateY(PI/6);
    rotateX(PI/20);
    scale(this.weaponScale);
    
    // Create a more detailed pistol model
    
    // Main body - dark gray
    fill(40);
    stroke(20);
    strokeWeight(0.3);
    
    // Slide (top part)
    push();
    translate(0, -2, 10);
    box(14, 6, 40);
    
    // Slide details
    fill(20);
    translate(0, -3.1, -5);
    box(10, 0.5, 15); // Rear sight
    
    // Front sight
    translate(0, 0, 25);
    box(2, 1, 1);
    pop();
    
    // Lower frame with trigger guard
    fill(30);
    push();
    translate(0, 4, 5);
    box(12, 10, 30); // Lower receiver
    
    // Trigger guard
    translate(0, 8, 3);
    rotateX(PI/2);
    fill(20);
    torus(5, 1.5, 20, 8);
    
    // Trigger
    fill(70);
    translate(0, 0, 2);
    box(2, 1, 4);
    pop();
    
    // Handle/grip
    push();
    fill(45);
    translate(0, 12, 0);
    
    // Main grip
    box(10, 24, 14);
    
    // Grip texture - small indentations
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
    
    // Bottom of magazine
    fill(50);
    translate(0, 13, 0);
    box(9.5, 2, 13.5);
    pop();
    
    // Barrel and muzzle
    push();
    fill(20);
    translate(0, -2, 25);
    cylinder(2.5, 15);
    
    // Muzzle
    fill(10);
    translate(0, 0, 7.5);
    cylinder(3, 2);
    pop();
    
    // Hammer
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

  fire() {
    if (super.fire()) {
      // Update recoil animation timing
      this.lastFireTime = millis();
      
      // Other pistol-specific firing effects could be added here
      // Like sound effects, muzzle flash, etc.
      return true;
    }
    return false;
  }
  
  // Helper function to create cylinders (p5js doesn't have a built-in cylinder)
  cylinder(radius, height) {
    const resolution = 24;
    
    // Top face
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
    
    // Bottom face
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
    
    // Side faces
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
