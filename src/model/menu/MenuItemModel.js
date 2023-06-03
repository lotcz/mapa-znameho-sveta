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

	constructor(text = '', onClick = null, persistent = false) {
		super(persistent);

		this.text = this.addProperty('text', new StringValue(text));
		this.isActive = this.addProperty('isActive', new BoolValue(false));

		if (onClick) {
			this.addEventListener(
				'click',
				onClick
			);
		}
	}

}
