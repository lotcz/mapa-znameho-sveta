import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";
import NullableNodeRenderer from "../../basic/NullableNodeRenderer";
import InventoryRenderer from "./inventory/InventoryRenderer";
import ConditionalNodeRenderer from "../../basic/ConditionalNodeRenderer";
import PortraitsRenderer from "./portraits/PortraitsRenderer";

export default class PartyRenderer extends DomRenderer {

	/**
	 * @type PartyModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'party paper flex-1');
		this.container.addEventListener('click', (e) => {
			e.stopPropagation();
			e.preventDefault();
		});

		this.inner = Pixies.createElement(this.container, 'div', 'inner row stretch p-2');
		this.portraits = Pixies.createElement(this.inner, 'div', 'portraits column');
		this.inventory = Pixies.createElement(this.inner, 'div', 'inventory-wrapper row stretch');

		this.addChild(
			new PortraitsRenderer(
				this.game,
				this.model,
				this.portraits
			)
		);

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.model.isInventoryVisible,
				() => this.model.isInventoryVisible.get(),
				() => new NullableNodeRenderer(
					this.game,
					this.model.selectedCharacter,
					(m) => new InventoryRenderer(this.game, m, this.model, this.inventory)
				)
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

}
