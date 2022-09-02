import DirtyValue from "./DirtyValue";

export default class FloatValue extends DirtyValue {

	set(value) {
		super.set(parseFloat(value));
	}

}
