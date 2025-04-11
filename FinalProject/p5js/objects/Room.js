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

    this.useDynamicLighting = true;
    this.lightingMode = 0; // 0: dynamic lighting, 1: default lighting
    this.lightAngle = 0;

    this.initColliders();
  }

  initColliders() {
    this.colliders = [];

    const wallThickness = 20;

    // Room walls
    // Left wall
    this.addCollider({
      x: -this.width / 2,
      y: 0,
      z: 0,
      w: wallThickness,
      h: this.height,
      d: this.depth
    }, color(100, 100, 100, 50));

    // Right wall
    this.addCollider({
      x: this.width / 2,
      y: 0,
      z: 0,
      w: wallThickness,
      h: this.height,
      d: this.depth
    }, color(100, 100, 100, 50));

    // Back wall
    this.addCollider({
      x: 0,
      y: 0,
      z: -this.depth / 2,
      w: this.width,
      h: this.height,
      d: wallThickness
    }, color(100, 100, 100, 50));

    // Front wall
    this.addCollider({
      x: 0,
      y: 0,
      z: this.depth / 2,
      w: this.width,
      h: this.height,
      d: wallThickness
    }, color(100, 100, 100, 50));

    // Floor (optional)
    this.addCollider({
      x: 0,
      y: this.height / 2 - wallThickness / 2,
      z: 0,
      w: this.width,
      h: wallThickness,
      d: this.depth
    }, color(100, 100, 100, 50));
  }

  addCollider({ x, y, z, w, h, d }, fillColor) {
    const collider = {
      x, y, z,
      w, h, d,
      minX: x - w / 2, maxX: x + w / 2,
      minY: y - h / 2, maxY: y + h / 2,
      minZ: z - d / 2, maxZ: z + d / 2,
      fillColor,
      type: 'box'
    };

    this.colliders.push(collider);
    return collider;
  }

  addBoxCollider({ x, y, z, w, h, d }, fillColor) {
    const collider = this.addCollider({ x, y, z, w, h, d }, fillColor);

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

  setupCustomLighting() {
    noLights();

    ambientLight(40, 40, 50);

    this.lightAngle += 0.005;
    let lightX = sin(this.lightAngle) * this.width * 0.7;
    let lightY = -this.height * 0.3; // Light from above
    let lightZ = cos(this.lightAngle) * this.depth * 0.7;

    pointLight(255, 245, 220, lightX, lightY, lightZ);

    pointLight(130, 160, 255, -lightX, lightY * 1.5, -lightZ);

    pointLight(5, 5, 10, lightX * 0.8, lightY * 0.5, lightZ * 0.8);

    spotLight(
      255, 255, 255,            // White color
      0, -this.height * 0.4, 0, // Position above center
      0, 1, 0,                  // Direction pointing down
      PI / 3,                   // Angle
      2                         // Concentration
    );

    pointLight(255, 30, 0,
      this.width * 0.4,
      -this.height * 0.3,
      this.depth * 0.4);
  }

  toggleLighting() {
    this.lightingMode = (this.lightingMode + 1) % 2;
  }

  display() {
    push();

    if (this.lightingMode === 0) {
      this.setupCustomLighting();
    } else {
      lights();
    }

    noFill();
    noStroke();

    box(this.width, this.height, this.depth);

    for (const collider of this.colliders) {
      push();
      translate(collider.x, collider.y, collider.z);
      fill(collider.fillColor);
      box(collider.w, collider.h, collider.d);
      pop();
    }

    push();
    specularMaterial(50);
    shininess(5);

    translate(-this.width / 2, 0, 0);
    rotateY(PI / 2);
    fill(this.wallColor);
    plane(this.depth, this.height);
    pop();

    push();
    specularMaterial(50);
    shininess(5);

    translate(this.width / 2, 0, 0);
    rotateY(PI / 2);
    fill(this.wallColor);
    plane(this.depth, this.height);
    pop();

    push();
    specularMaterial(30);
    shininess(2);

    translate(0, -this.height / 2, 0);
    rotateX(PI / 2);
    fill(this.wallColor);
    plane(this.width, this.depth);
    pop();

    push();
    specularMaterial(50);
    shininess(5);

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
