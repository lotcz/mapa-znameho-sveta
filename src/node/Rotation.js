import DirtyValue from "./DirtyValue";

export default class Rotation extends DirtyValue {

	static normalizeValue(value) {
		let result = value % 360;
		if (result > 180) {
			result = result - 360;
		}
		if (result < -180) {
			result = result + 360;
		}
		return result;
	}

	set(value) {
		const normalized = Rotation.normalizeValue(value);
		super.set(normalized);
	}

	add(value) {
		this.set(this.get() + value);
	}

	static subtractValues(a, b) {
		let diff = a - b;
		if (diff > 180) {
			diff = 360 - diff;
		}
		if (diff < -180) {
			diff = 360 + diff;
		}
		return diff;
	}

	equalsTo(value) {
		return (this.value === Rotation.normalizeValue(value));
	}

	clone() {
		return new Rotation(this.value);
	}

}
