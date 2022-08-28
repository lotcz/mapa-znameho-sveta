import DirtyValue from "./DirtyValue";

export default class BoolValue extends DirtyValue {

	set(value) {
		if (typeof value === 'string') {
			super.set(value !== 'false');
		} else {
			super.set(value !== undefined && value !== null && value !== false);
		}
	}

}
