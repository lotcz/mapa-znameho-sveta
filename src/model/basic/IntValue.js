import DirtyValue from "./DirtyValue";

export default class IntValue extends DirtyValue {

	set(value) {
		super.set(parseInt(value));
	}

}