import DirtyValue from "./DirtyValue";

export default class IntValue extends DirtyValue {

	set(value) {
		if (value === null || value === undefined || value === '') {
			super.set(Number.NaN);
		} else {
			super.set(Number(value));
		}
	}

	isEmpty() {
		return super.isEmpty() || Number.isNaN(this.value);
	}

	increase(num) {
		this.set(this.get() + num);
	}
}
