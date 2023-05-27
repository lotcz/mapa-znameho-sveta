import IntValue from "./IntValue";

export default class FloatValue extends IntValue {

	round() {
		return Math.round(this.get());
	}
}
