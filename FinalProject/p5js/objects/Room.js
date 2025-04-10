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
    // Create a collider object with more properties for improved collision detection
    const collider = { 
      x, y, z,  // Center position
      w, h, d,  // Dimensions
      minX: x - w/2, maxX: x + w/2,  // Bounds for AABB collision
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

  // Check if a point is inside any collider
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
  
  // Check if a sphere (bullet, player) collides with any collider
  checkSphereCollision(position, radius) {
    for (const collider of this.colliders) {
      // Find the closest point on the box to the sphere
      const closestX = Math.max(collider.minX, Math.min(position.x, collider.maxX));
      const closestY = Math.max(collider.minY, Math.min(position.y, collider.maxY));
      const closestZ = Math.max(collider.minZ, Math.min(position.z, collider.maxZ));
      
      // Calculate the distance between the sphere's center and the closest point
      const distance = dist(position.x, position.y, position.z, closestX, closestY, closestZ);
      
      // If the distance is less than the sphere's radius, collision detected
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
  
  // Method for checking bullet collision
  checkBulletCollision(bullet) {
    if (!bullet || !bullet.position) return false;
    
    const bulletSize = bullet.size || 5;
    const result = this.checkSphereCollision(bullet.position, bulletSize);
    
    return result !== null;
  }
  
  // Method to resolve player collision
  resolvePlayerCollision(player) {
    if (!player) return;
    
    const result = this.checkSphereCollision(player.pos, player.size);
    if (result) {
      // Push player away from collision
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

    // Reset colliders array before adding new ones
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

    // Add boundary walls as colliders
    const wallThickness = 10;
    
    // Left wall
    this.addBoxCollider({
      x: -this.width / 2,
      y: 0,
      z: 0,
      w: wallThickness,
      h: this.height,
      d: this.depth
    }, color(0, 0, 0, 0));
    
    // Right wall
    this.addBoxCollider({
      x: this.width / 2,
      y: 0,
      z: 0,
      w: wallThickness,
      h: this.height,
      d: this.depth
    }, color(0, 0, 0, 0));
    
    // Front wall
    this.addBoxCollider({
      x: 0,
      y: 0,
      z: -this.depth / 2,
      w: this.width,
      h: this.height,
      d: wallThickness
    }, color(0, 0, 0, 0));
    
    // Back wall
    this.addBoxCollider({
      x: 0,
      y: 0,
      z: this.depth / 2,
      w: this.width,
      h: this.height,
      d: wallThickness
    }, color(0, 0, 0, 0));

    // Draw the visible walls
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
  
  // Helper method to get all colliders
  getColliders() {
    return this.colliders;
  }
}
