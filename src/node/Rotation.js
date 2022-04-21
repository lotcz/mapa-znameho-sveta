import DirtyValue from "./DirtyValue";

/**
 * Keeps track of rotation in radians or degrees that is always in interval (-pi, +pi> which equals to (-180, 180> degrees
 */
export default class Rotation extends DirtyValue {

	static normalizeValue(rads) {
		const range = 2 * Math.PI;
		let result = rads % range;
		if (result > (range / 2)) {
			result = result - range;
		}
		if (result < (-range / 2)) {
			result = result + range;
		}
		return result;
	}

	static radToDeg(rads) {
		return rads * 180 / Math.PI;
	}

	static degToRad(degs) {
		return degs * Math.PI / 180;
	}

	set(value) {
		const normalized = Rotation.normalizeValue(value);
		super.set(normalized);
	}

	equalsTo(value) {
		return (this.value === Rotation.normalizeValue(value));
	}

	clone() {
		return new Rotation(this.value);
	}

	setDegrees(value) {
		this.set(Rotation.degToRad(value));
	}

	getDegrees() {
		return Rotation.radToDeg(this.get());
	}

}
