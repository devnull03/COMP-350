class Room {
  constructor(width, height, depth) {
    this.width = width;
    this.height = height;
    this.depth = depth;


    this.colliders = [];

    // Colors
    this.wallColor = color(200, 200, 200);
    this.tableColor = color(139, 69, 19);
    this.objectColor1 = color(0, 0, 255);
    this.objectColor2 = color(0, 255, 0);
  }


  addBoxCollider({ x, y, z, w, h, d }, fillColor) {
    this.colliders.push({ x, y, z, w, h, d });

    push();
    translate(x, y, z);
    fill(fillColor);
    box(w, h, d);
    pop();
  }

  display() {
    push();
    noFill();
    stroke(255);


    box(this.width, this.height, this.depth);

   
    this.addBoxCollider({
      x: this.width / 4,
      y: 0,
      z: -this.depth / 3,
      w: this.width / 2,
      h: this.height,
      d: 80
    }, color(0, 255, 0)); 

    this.addBoxCollider({
      x: this.width / 4,
      y: 0,
      z: this.depth / 6,
      w: this.width / 2,
      h: this.height,
      d: 80
    }, color(0, 0, 255)); 

    this.addBoxCollider({
      x: -this.width / 4,
      y: 0,
      z: -this.depth / 9,
      w: this.width / 2,
      h: this.height,
      d: 80
    }, color(0, 0, 255)); 


    push();
    translate(-this.width / 2, 0, 0);
    rotateY(PI / 2);
    fill(this.wallColor);
    plane(this.depth, this.height);
    pop();

  
    push();
    translate(this.width / 2, 0, 0);
    rotateY(PI / 2);
    fill(this.wallColor);
    plane(this.depth, this.height);
    pop();


    push();
    translate(0, -this.height / 2, 0);
    rotateX(PI / 2);
    fill(this.wallColor);
    plane(this.width, this.depth);
    pop();


    push();
    translate(0, 0, -this.depth / 2);
    fill(this.wallColor);
    plane(this.width, this.height);
    pop();

    pop();
  }
}
