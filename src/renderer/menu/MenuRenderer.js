import DomRenderer from "../basic/DomRenderer";
import CollectionRenderer from "../basic/CollectionRenderer";
import MenuItemRenderer from "./MenuItemRenderer";
import Pixies from "../../class/basic/Pixies";

export default class MenuRenderer extends DomRenderer {

	/**
	 * @type MenuModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.items,
				(m) => new MenuItemRenderer(this.game, m, this.items)
			)
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'main-menu-layer');
		this.paper = Pixies.createElement(this.container, 'div', 'main-menu paper');
		this.inner = Pixies.createElement(this.paper, 'div', 'inner p-3');
		this.items = Pixies.createElement(this.inner, 'div', 'items m-3');
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}
}
