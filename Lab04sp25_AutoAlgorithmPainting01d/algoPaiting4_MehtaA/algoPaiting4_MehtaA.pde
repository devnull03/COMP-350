PImage inspo;
MousePolygon mousePoly;

PolygonCollection[] polygonCollections;

void setup() {
	size(800, 800);
	mousePoly = new MousePolygon();
	inspo = loadImage("inspo.jpg");
	polygonCollections = new PolygonCollection[] { 
		new PolygonCollection("data/walls_polygon.txt"), 
		new PolygonCollection("data/window_polygon.txt"), 
		new PolygonCollection("data/lamp_polygon.txt"), 
		new PolygonCollection("data/face_polygon.txt"), 
		new PolygonCollection("data/bedsheet_polygon.txt"), 
		new PolygonCollection("data/hands_polygon.txt")
	};
}

void draw() {
	image(inspo, 0, 0, width, height);
	mousePoly.drawPolygon();
	
	for (PolygonCollection pc : polygonCollections) {
		pc.drawPolygons();
	}
	drawShapes();
}

void mouseClicked() {
	mousePoly.handleMouseClick(mouseX, mouseY);
}

void keyPressed() {
	mousePoly.handleKey(key);
}

void drawShapes() {
  // Slow down shape rendering: only draw every 60 frames.
  if (frameCount % 8 != 0) {
    return;
  }

  // Draw a random point
  stroke(255, 0, 0);
  strokeWeight(5);
  point(random(width), random(height));
  
  // Draw a random rectangle with 30% chance
  if (random(1) < 0.3) {
    if (random(1) < 0.5) {
      fill(0, 255, 0);
    } else {
      fill(0, 0, 255);
    }
    noStroke();
    rect(random(width), random(height), random(20, 100), random(20, 100));
  }
  
  // Draw a random circle with 30% chance
  if (random(1) < 0.3) {
    fill(255, 255, 0);
    ellipse(random(width), random(height), random(20, 50), random(20, 50));
  }
  
  // Draw a random line
  stroke(255);
  strokeWeight(2);
  line(random(width), random(height), random(width), random(height));
  
  // Draw a random polygon using a for-loop
  int sides = int(random(3, 8));
  float centerX = random(width);
  float centerY = random(height);
  float radius = random(20, 50);
  fill(150, 0, 150);
  stroke(0);
  beginShape();
  for (int i = 0; i < sides; i++) {
    float angle = TWO_PI / sides * i;
    vertex(centerX + cos(angle) * radius, centerY + sin(angle) * radius);
  }
  endShape(CLOSE);
  
  // Use a while loop to draw 3 additional random points
  int count = 0;
  stroke(0, 255, 255);
  strokeWeight(3);
  while (count < 3) {
    point(random(width), random(height));
    count++;
  }
}
