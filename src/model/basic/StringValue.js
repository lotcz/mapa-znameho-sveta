import DirtyValue from "./DirtyValue";

export default class StringValue extends DirtyValue {

	set(value) {
		if (typeof value === 'string') {
			super.set(value);
		} else {
			if (value && typeof value === 'object') {
				super.set(value.toString());
			} else {
				super.set('');
			}
		}
	}

	isEmpty() {
		return super.isEmpty() || this.value === '';
	}

}
