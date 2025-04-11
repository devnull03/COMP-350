# COMP 350 Final Project

Doom inspired game thingy using p5js


## How to run
1. Clone the repository to your local machine.
2. if you want to run the game locally, you can use a local server like `http-server` or `live-server`.


## UML Class Diagram

```mermaid
classDiagram
    %% Base classes
    class Humanoid {
        +pos: Vector
        +size: number
        +speed: number
        +yaw: number
        +pitch: number
        +health: number
        +armor: number
        +update()
        +getDirection()
        +takeDamage(amount)
        +die()
    }
    
    %% Player class
    class Player {
        +weapons: Array
        +currentWeaponIndex: number
        +isFiring: boolean
        +sensitivity: number
        +update()
        +handleMouseLook()
        +handleKeyPressed()
        +getCurrentWeapon()
        +switchWeapon()
    }
    
    %% Enemy class
    class Enemy {
        +enemyType: string
        +state: string
        +model: Object
        +detectionRange: number
        +attackRange: number
        +active: boolean
        +update()
        +display()
        +chasePlayer()
        +attackPlayer()
        +checkBulletCollision()
    }
    
    %% Weapon classes
    class Weapon {
        +name: string
        +damage: number
        +fireRate: number
        +reloadTime: number
        +ammoInMagazine: number
        +magazineSize: number
        +accuracy: number
        +model: Object
        +bullets: Array
        +update()
        +fire(position, direction)
        +reload()
        +display()
        +createBullet()
        +drawBullets()
    }
    
    class Shotgun {
        +bulletsPerShot: number
    }
    
    class Pistol {
        +weaponScale: number
        +cylinder(radius, height)
    }
    
    %% Environment classes
    class Room {
        +width: number
        +height: number
        +depth: number
        +colliders: Array
        +wallColor: color
        +lightingMode: number
        +display()
        +checkSphereCollision()
        +resolvePlayerCollision()
        +checkBulletCollision()
    }
    
    %% Handler classes
    class EnvironmentHandler {
        +entities: Object
        +update()
        +display()
        +addEnemy()
        +checkBulletCollisions()
        +checkAllCollisions()
        +cleanupDeadEnemies()
    }
    
    class GameState {
        +isPaused: boolean
        +showControls: boolean
        +pointerLocked: boolean
        +playerDeaths: number
        +hudType: number
        +displayMainMenu()
        +displayControls()
        +displayHUD()
        +handleKeyPressed()
        +handleMousePressed()
        +requestPointerLock()
    }
    
    class ModelUtils {
        +prepareModel()$
        +applyMaterial()$
        +displayModel()$
    }
    
    %% Inheritance relationships
    Humanoid <|-- Player
    Humanoid <|-- Enemy
    Weapon <|-- Shotgun
    Weapon <|-- Pistol
    
    %% Associations
    Player "1" --> "*" Weapon : has
    Player --> "1" GameState : uses
    EnvironmentHandler --> "*" Enemy : contains
    EnvironmentHandler --> "1" Room : uses
    Room --> "1" Player : collides with
    Enemy --> "1" Player : targets
    GameState --> "1" Player : monitors
```

## Class Descriptions

### Core Classes
- **Humanoid**: Base class for characters with movement, health, and orientation
- **Player**: User-controlled character with weapons and input handling
- **Enemy**: AI-controlled characters with different behaviors and states

### Weapon System
- **Weapon**: Base class for all weapons with firing, reload, and display logic
- **Shotgun**: Specialized weapon with multiple pellets per shot
- **Pistol**: Basic weapon with custom rendering

### Environment
- **Room**: 3D environment with collision detection and lighting
- **EnvironmentHandler**: Manages entities and collision detection

### Game Management
- **GameState**: Handles game state, UI, and input locking
- **ModelUtils**: Static helper class for 3D model operations
