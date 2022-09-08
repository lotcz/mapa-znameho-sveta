import ModelNode from "../../basic/ModelNode";
import FloatValue from "../../basic/FloatValue";
import Pixies from "../../../class/basic/Pixies";

export default class StatModel extends ModelNode {

	/**
	 * @type FloatValue
	 */
	max;

	/**
	 * @type FloatValue
	 */
	current;

	constructor() {
		super();

		this.max = this.addProperty('max', new FloatValue(1));
		this.current = this.addProperty('current', new FloatValue(0.5));
	}

	restore(amount) {
		const n = Pixies.between(0, this.max.get(), this.current.get() + amount);
		this.current.set(n);
	}

	consume(amount) {
		this.restore(-amount);
	}

}
