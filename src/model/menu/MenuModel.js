import ModelNodeCollection from "../basic/ModelNodeCollection";
import ModelNode from "../basic/ModelNode";
import StringValue from "../basic/StringValue";

export default class MenuModel extends ModelNode {

	/**
	 * @type StringValue
	 */
	name;

	/**
	 * @type ModelNodeCollection<MenuItemModel>
	 */
	items;

	constructor(name = '', persistent = false) {
		super(persistent);

		this.name = this.addProperty('name', new StringValue(name));
		this.items = this.addProperty('items', new ModelNodeCollection());

	}

}
