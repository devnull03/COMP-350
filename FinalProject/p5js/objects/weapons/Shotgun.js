class Shotgun extends Weapon {
	constructor(model) {
		super("Shotgun", 60, 2, 2, 16, 0.7, model);

		this.pelletCount = 8;
		this.spreadAngle = 0.2;
	}

	// Override the display method to handle different orientation
	display() {
		push();
		drawingContext.disable(drawingContext.DEPTH_TEST);

		// Move to 2D rendering coordinates
		translate(-width / 2, -height / 2, 0);

		// Calculate recoil animation
		if (millis() - this.lastFireTime < 150) {
			// Apply recoil
			this.recoilAmount = this.maxRecoil;
		} else if (this.recoilAmount > 0) {
			// Recover from recoil
			this.recoilAmount *= this.recoilRecoveryRate;
			if (this.recoilAmount < 0.1) this.recoilAmount = 0;
		}

		// Position in bottom right, with barrel facing center
		translate(width - this.displayX, height - this.displayY + this.recoilAmount, this.displayZ);

		
		rotateZ(-PI);
		rotateY(PI-12);
		rotateX(PI / 8);
		scale(this.modelScale);

		ambientLight(255, 0, 0);
		model(this.model);

		drawingContext.enable(drawingContext.DEPTH_TEST);
		pop();
	}

	// Override fire method to implement shotgun behavior
	fire() {
		// Can't fire if reloading or if not enough time has passed since last shot
		if (this.isReloading) return false;
		if (millis() - this.lastFireTime < 1000 / this.fireRate) return false;

		// Check if we have ammo
		if (this.ammoInMagazine <= 0) {
			this.reload();
			return false;
		}

		// Fire the weapon
		this.ammoInMagazine--;
		this.lastFireTime = millis();

		// Shotgun fires multiple pellets with each shot
		let hitCount = 0;
		for (let i = 0; i < this.pelletCount; i++) {
			// Each pellet has independent accuracy check
			let adjustedAccuracy = this.accuracy * (1 - (random() * this.spreadAngle));
			if (random() <= adjustedAccuracy) {
				hitCount++;
			}
		}

		console.log(`Fired ${this.name}: ${hitCount}/${this.pelletCount} pellets hit, Ammo left: ${this.ammoInMagazine}`);
		return hitCount > 0;
	}
}
