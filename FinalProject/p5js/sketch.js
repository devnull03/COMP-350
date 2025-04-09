let player;
let room;
let gameState;
let myFont;
let bullets = [];

let BFG_model;
let Shotgun_model;

function preload() {
  myFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf');
  BFG_model = loadModel(
    'data/BFG-9000.obj',
    true,
    function () {
      console.log("BFG model loaded successfully");
    },
    function () {
      console.error("Error loading BFG model");
    });
  Shotgun_model = loadModel(
    'data/Shtgnn.obj',
    true,
    function () {
      console.log("Shotgun model loaded successfully");
    },
    function () {
      console.error("Error loading Shotgun model");
    });
}

function setup() {
  let mainCanvas = createCanvas(windowWidth, windowHeight, WEBGL);

  let playerWeapons = [
    new Weapon("BFG-9000", 15, 50, 2, 400, 0.8, BFG_model),
    new Pistol(),
    new Shotgun(Shotgun_model),
  ]

  player = new Player(0, 0, 0, 20, playerWeapons);
  room = new Room(5000, 1000, 5000);
  gameState = new GameState();

  textFont(myFont);

  lights();

  // Add pointer lock event listeners
  document.addEventListener('pointerlockchange', pointerLockChange);
  document.addEventListener('mozpointerlockchange', pointerLockChange);
  document.addEventListener('webkitpointerlockchange', pointerLockChange);

  console.log("Setup complete");
}

function draw() {
  background(0);

  if (gameState.isPaused) {
    gameState.displayMainMenu();
  } else {
    push();

    ambientLight(50, 50, 50);
    directionalLight(255, 255, 255, 0, 1, -1);

    player.update();
    room.display();

    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].update(); // Update bullet position
      bullets[i].display(); // Display bullet
      if (bullets[i].lifetime > bullets[i].maxLifetime) {
        bullets.splice(i, 1); // Remove bullet if it has exceeded its lifetime
      }
    }

    pop();

    if (player.hasWeapon()) {
      player.getCurrentWeapon().display();
    }

    // Add this line to display the HUD when game is running
    gameState.displayHUD(player);
  }

  if (gameState.showControls) {
    gameState.displayControls();
  }
}

function keyPressed() {
  player.handleKeyPressed(key, keyCode);
  gameState.handleKeyPressed(key, keyCode);

  if (keyCode.toString().endsWith('ARROW')) {
    return false;
  }
}

function keyReleased() {
  player.handleKeyReleased(key, keyCode);
  return false;
}

function mouseMoved() {
  if (typeof gameState !== 'undefined' &&
    gameState !== null &&
    !gameState.isPaused &&
    !gameState.showControls &&
    gameState.pointerLocked) {

    if (typeof player !== 'undefined' && player !== null) {
      player.handleMouseLook(movedX, movedY);
    }
  }
  return false;
}

function mousePressed() {

  if (typeof gameState !== 'undefined' && gameState !== null) {
    if (gameState.isPaused && !gameState.showControls) {
      gameState.isPaused = false;
      gameState.requestPointerLock();
    } else if (!gameState.isPaused && gameState.pointerLocked) {
      if (typeof player !== 'undefined' && player !== null) {
        player.isFiring = true;
      }
    }
  }
  return false;
}

function mouseReleased() {
  if (typeof player !== 'undefined' && player !== null) {
    player.isFiring = false;
  }
  return false;
}

function pointerLockChange() {
  console.log("Pointer lock change detected");
  if (document.pointerLockElement === document.querySelector('canvas') ||
    document.mozPointerLockElement === document.querySelector('canvas') ||
    document.webkitPointerLockElement === document.querySelector('canvas')) {

    console.log("Pointer is locked");
    gameState.pointerLocked = true;
    gameState.isPaused = false; // Ensure the game is unpaused when pointer is locked
  } else {
    console.log("Pointer is unlocked");
    gameState.pointerLocked = false;
    if (!gameState.isPaused) {
      gameState.isPaused = true;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  room = new Room(windowWidth * 0.5, windowHeight * 0.5, windowWidth * 0.5);
  player.resetPosition();
}
