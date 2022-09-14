import IntValue from "../../../basic/IntValue";
import Pixies from "../../../../class/basic/Pixies";
import StatBaseModel from "./StatBaseModel";

export default class StatIntModel extends StatBaseModel {

	/**
	 * @type IntValue
	 */
	max;

	/**
	 * @type IntValue
	 */
	current;

	constructor(definitionId) {
		super(definitionId);

		this.max = this.addProperty('max', new IntValue(10));
		this.current = this.addProperty('current', new IntValue(5));
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

}
