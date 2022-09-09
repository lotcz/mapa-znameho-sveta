import FloatValue from "../../basic/FloatValue";
import Pixies from "../../../class/basic/Pixies";
import StatBaseModel from "./StatBaseModel";

export default class StatFloatModel extends StatBaseModel {

	/**
	 * @type FloatValue
	 */
	max;

	/**
	 * @type FloatValue
	 */
	current;

	constructor(definitionId) {
		super(definitionId);

		this.max = this.addProperty('max', new FloatValue(1));
		this.current = this.addProperty('current', new FloatValue(0.5));
	}

	set(n) {
		this.current.set(Pixies.between(0, this.max.get(), n));
	}

	restore(amount) {
		this.set(this.current.get() + amount);
	}

	consume(amount) {
		this.restore( - amount );
	}

	getCurrentPortion() {
		return this.current.get() / this.max.get();
	}
}
