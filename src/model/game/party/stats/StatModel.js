import Pixies from "../../../../class/basic/Pixies";
import IntValue from "../../../basic/IntValue";
import ModelNode from "../../../basic/ModelNode";

export default class StatModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	definitionId;

	/**
	 * @type IntValue
	 */
	baseValue;

	/**
	 * @type IntValue
	 */
	current;

	constructor(definitionId) {
		super();

		this.definitionId = this.addProperty('definitionId', new IntValue(definitionId));
		this.baseValue = this.addProperty('baseValue', new IntValue(1));
		this.current = this.addProperty('current', new IntValue(0.5));
	}

	set(n) {
		this.current.set(Pixies.between(0, this.baseValue.get(), n));
	}

	restore(amount) {
		this.set(this.current.get() + amount);
	}

	consume(amount) {
		this.restore( - amount );
	}

	getCurrentPortion() {
		return this.current.get() / this.baseValue.get();
	}
}
