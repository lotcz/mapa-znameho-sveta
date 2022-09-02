import DirtyValue from "./DirtyValue";

export default class FloatValue extends DirtyValue {

	set(value) {
		super.set(typeof value === 'string' ? parseFloat(value) : value);
	}

}
