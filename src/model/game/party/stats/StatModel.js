import Pixies from "../../../../class/basic/Pixies";
import IntValue from "../../../basic/IntValue";
import ModelNode from "../../../basic/ModelNode";
import FloatValue from "../../../basic/FloatValue";
import NullableNode from "../../../basic/NullableNode";

export default class StatModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	definitionId;

	/**
	 * @type NullableNode<StatDefinitionModel>
	 */
	definition;

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

	constructor(definitionId, initialValue = 0, persistent = true) {
		super(persistent);

		this.definitionId = this.addProperty('definitionId', new IntValue(definitionId, false));
		this.definition = this.addProperty('definition', new NullableNode(null, false));
		this.baseValue = this.addProperty('baseValue', new IntValue(initialValue));
		this.currentFloat = this.addProperty('currentFloat', new FloatValue(initialValue));
		this.current = this.addProperty('current', new IntValue(initialValue, false));

		this.currentFloat.addOnChangeListener(() => this.current.set(Math.ceil(this.currentFloat.get())));
	}

	restore(amount) {
		const val = Pixies.between(0, this.baseValue.get(), this.currentFloat.get() + amount);
		this.currentFloat.set(val);
	}

	consume(amount) {
		this.restore( - amount );
	}

	getProgress() {
		return this.baseValue.get() / this.currentFloat.get();
	}
}
