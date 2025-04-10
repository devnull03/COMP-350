class Shotgun extends Weapon {
	constructor(model) {
		super("Shotgun", 60, 2, 2, 16, 0.7, model);

		this.pelletCount = 8;
		this.spreadAngle = 0.2;
	}

	display() {
		push();
		drawingContext.disable(drawingContext.DEPTH_TEST);

		translate(-width / 2, -height / 2, 0);

		if (millis() - this.lastFireTime < 150) {
			this.recoilAmount = this.maxRecoil;
		} else if (this.recoilAmount > 0) {
			this.recoilAmount *= this.recoilRecoveryRate;
			if (this.recoilAmount < 0.1) this.recoilAmount = 0;
		}

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

	fire() {
		if (this.isReloading) return false;
		if (millis() - this.lastFireTime < 1000 / this.fireRate) return false;

		if (this.ammoInMagazine <= 0) {
			this.reload();
			return false;
		}

		this.ammoInMagazine--;
		this.lastFireTime = millis();

		let hitCount = 0;
		for (let i = 0; i < this.pelletCount; i++) {
			let adjustedAccuracy = this.accuracy * (1 - (random() * this.spreadAngle));
			if (random() <= adjustedAccuracy) {
				hitCount++;
			}
		}

		console.log(`Fired ${this.name}: ${hitCount}/${this.pelletCount} pellets hit, Ammo left: ${this.ammoInMagazine}`);
		return hitCount > 0;
	}
}
