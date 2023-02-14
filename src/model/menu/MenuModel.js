import ModelNodeCollection from "../basic/ModelNodeCollection";
import ModelNode from "../basic/ModelNode";
import StringValue from "../basic/StringValue";
import MenuItemModel from "./MenuItemModel";

export default class MenuModel extends ModelNode {

	/**
	 * @type StringValue
	 */
	name;

	/**
	 * @type ModelNodeCollection<MenuItemModel>
	 */
	items;

	constructor() {
		super(false);

		this.name = this.addProperty('name', new StringValue());
		this.items = this.addProperty('items', new ModelNodeCollection());

	}

	static createMenu(name, options) {
		const menu = new MenuModel();
		menu.name.set(name);
		options.forEach((option) => {
			const item = new MenuItemModel();
			item.text.set(option.text);
			item.addEventListener(
				'click',
				option.onClick
			);
			menu.items.add(item);
		});
		return menu;
	}
}
