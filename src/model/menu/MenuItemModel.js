import ModelNode from "../basic/ModelNode";
import StringValue from "../basic/StringValue";
import BoolValue from "../basic/BoolValue";

export default class MenuItemModel extends ModelNode {

	/**
	 * @type StringValue
	 */
	text;

	/**
	 * @type BoolValue
	 */
	isActive;

	constructor() {
		super(false);

		this.text = this.addProperty('text', new StringValue());
		this.isActive = this.addProperty('isActive', new BoolValue(false));
	}

}
