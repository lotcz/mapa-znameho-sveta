import DirtyValue from "./DirtyValue";

export default class IntValue extends DirtyValue {

	set(value) {
		super.set(typeof value === 'string' ? parseInt(value) : value);
	}

}
