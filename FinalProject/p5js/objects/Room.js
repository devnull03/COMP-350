class Room {
  constructor(width, height, depth) {
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.colliders = [];

    this.wallColor = color(200, 200, 200);
    this.tableColor = color(139, 69, 19);
    this.objectColor1 = color(0, 0, 255);
    this.objectColor2 = color(0, 255, 0);
  }

  addBoxCollider({ x, y, z, w, h, d }, fillColor) {
    const collider = { 
      x, y, z,
      w, h, d,
      minX: x - w/2, maxX: x + w/2,
      minY: y - h/2, maxY: y + h/2,
      minZ: z - d/2, maxZ: z + d/2,
      fillColor,
      type: 'box'
    };
    
    this.colliders.push(collider);

    push();
    translate(x, y, z);
    fill(fillColor);
    box(w, h, d);
    pop();
    
    return collider;
  }

  checkPointCollision(point) {
    for (const collider of this.colliders) {
      if (point.x >= collider.minX && point.x <= collider.maxX &&
          point.y >= collider.minY && point.y <= collider.maxY &&
          point.z >= collider.minZ && point.z <= collider.maxZ) {
        return collider;
      }
    }
    return null;
  }
  
  checkSphereCollision(position, radius) {
    for (const collider of this.colliders) {
      const closestX = Math.max(collider.minX, Math.min(position.x, collider.maxX));
      const closestY = Math.max(collider.minY, Math.min(position.y, collider.maxY));
      const closestZ = Math.max(collider.minZ, Math.min(position.z, collider.maxZ));
      
      const distance = dist(position.x, position.y, position.z, closestX, closestY, closestZ);
      
      if (distance < radius) {
        return {
          collider,
          penetration: radius - distance,
          normal: createVector(position.x - closestX, position.y - closestY, position.z - closestZ).normalize()
        };
      }
    }
    return null;
  }
  
  checkBulletCollision(bullet) {
    if (!bullet || !bullet.position) return false;
    
    const bulletSize = bullet.size || 5;
    const result = this.checkSphereCollision(bullet.position, bulletSize);
    
    return result !== null;
  }
  
  resolvePlayerCollision(player) {
    if (!player) return;
    
    const result = this.checkSphereCollision(player.pos, player.size);
    if (result) {
      const pushDirection = result.normal;
      const pushAmount = result.penetration;
      
      player.pos.x += pushDirection.x * pushAmount;
      player.pos.y += pushDirection.y * pushAmount;
      player.pos.z += pushDirection.z * pushAmount;
    }
  }

  display() {
    push();
    noFill();
    stroke(255);

    box(this.width, this.height, this.depth);

    this.colliders = [];
   
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

    const wallThickness = 10;
    
    this.addBoxCollider({
      x: -this.width / 2,
      y: 0,
      z: 0,
      w: wallThickness,
      h: this.height,
      d: this.depth
    }, color(0, 0, 0, 0));
    
    this.addBoxCollider({
      x: this.width / 2,
      y: 0,
      z: 0,
      w: wallThickness,
      h: this.height,
      d: this.depth
    }, color(0, 0, 0, 0));
    
    this.addBoxCollider({
      x: 0,
      y: 0,
      z: -this.depth / 2,
      w: this.width,
      h: this.height,
      d: wallThickness
    }, color(0, 0, 0, 0));
    
    this.addBoxCollider({
      x: 0,
      y: 0,
      z: this.depth / 2,
      w: this.width,
      h: this.height,
      d: wallThickness
    }, color(0, 0, 0, 0));

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
  
  getColliders() {
    return this.colliders;
  }
}
