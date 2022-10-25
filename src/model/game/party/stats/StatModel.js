import Pixies from "../../../../class/basic/Pixies";
import IntValue from "../../../basic/IntValue";
import ModelNode from "../../../basic/ModelNode";
import FloatValue from "../../../basic/FloatValue";

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
	 * @type FloatValue
	 */
	currentFloat;

	/**
	 * @type IntValue
	 */
	current;

	constructor(definitionId) {
		super();

		this.definitionId = this.addProperty('definitionId', new IntValue(definitionId));
		this.baseValue = this.addProperty('baseValue', new IntValue(1));
		this.currentFloat = this.addProperty('currentFloat', new FloatValue(1));
		this.current = this.addProperty('current', new IntValue(1, false));
		this.currentFloat.addOnChangeListener(
			() => {
				const f = this.currentFloat.get();
				/*
				if (f < 0) {
					this.currentFloat.set(0);
					return;
				}

				 */
				const r = Math.round(f);
				this.current.set(r);
			}
		);
	}

	restore(amount) {
		const val = Pixies.between(0, this.baseValue.get(), this.currentFloat.get() + amount);
		this.currentFloat.set(val);
	}

	consume(amount) {
		this.restore( - amount );
	}
}
