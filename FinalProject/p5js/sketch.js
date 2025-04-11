let player;
let room;
let gameState;
let myFont;
let bullets = [];
let environmentHandler;

// Model variables
let BFG_model;
let Shotgun_model;
let enemy_model;
let enemyModel;
let weaponModels = {};

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
  enemy_model = loadModel(
    'data/bruh_im_dead_fr_fr/bruh_im_dead_fr_fr.obj',
    true,
    function () {
      console.log("Enemy model loaded successfully");
    },
    function () {
      console.error("Error loading Enemy model");
    });

  // Load models with proper settings
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
  environmentHandler = new EnvironmentHandler();

  textFont(myFont);

  lights();

  document.addEventListener('pointerlockchange', pointerLockChange);
  document.addEventListener('mozpointerlockchange', pointerLockChange);
  document.addEventListener('webkitpointerlockchange', pointerLockChange);

  environmentHandler.addEnemy(new Enemy(-500, -500, 30, enemy_model, 'basic'));
  environmentHandler.addEnemy(new Enemy(500, 500, 25, enemy_model, 'fast'));
  environmentHandler.addEnemy(new Enemy(0, -1000, 40, enemy_model, 'heavy'));

  // Prepare models for rendering
  if (enemyModel) {
    ModelUtils.prepareModel(enemyModel);
  }

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

    environmentHandler.update();
    environmentHandler.display();

    if (player.isFiring && player.hasWeapon()) {
      player.getCurrentWeapon().fire(player.pos, player.getDirection());
    }

    player.getCurrentWeapon().update();
    player.getCurrentWeapon().drawBullets();

    environmentHandler.checkAllCollisions(player);

    if (frameCount % 300 === 0) {
      environmentHandler.cleanupDeadEnemies();
    }

    pop();

    if (player.hasWeapon()) {
      player.getCurrentWeapon().display();
    }

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
        if (mouseButton === LEFT) {
          player.isFiring = true;
        }
      }
    }
  }
  return false;
}

function mouseReleased() {
  if (typeof player !== 'undefined' && player !== null) {
    if (mouseButton === LEFT) {
      player.isFiring = false;
    }
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
    gameState.isPaused = false;
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