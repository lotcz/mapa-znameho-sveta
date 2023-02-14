import ModelNodeCollection from "../basic/ModelNodeCollection";
import ModelNode from "../basic/ModelNode";

export default class MenuModel extends ModelNode {

	/**
	 * @type ModelNodeCollection<MenuItemModel>
	 */
	items;

	constructor() {
		super(false);

		this.items = this.addProperty('items', new ModelNodeCollection());

	}

}
