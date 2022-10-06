import DomRenderer from "../../basic/DomRenderer";
import CollectionRenderer from "../../basic/CollectionRenderer";
import Pixies from "../../../class/basic/Pixies";
import PartySlotRenderer from "./PartySlotRenderer";
import NullableNodeRenderer from "../../basic/NullableNodeRenderer";
import InventoryRenderer from "./InventoryRenderer";
import ConditionalNodeRenderer from "../../basic/ConditionalNodeRenderer";

export default class PartyRenderer extends DomRenderer {

	/**
	 * @type PartyModel
	 */
	model;

	/**
	 * @type CollectionRenderer
	 */
	charactersRenderer;

	constructor(game, model, dom, topLayer) {
		super(game, model, dom);

		this.model = model;
		this.topLayer = topLayer;

		this.charactersRenderer = new CollectionRenderer(this.game, this.model.slots, (m) => new PartySlotRenderer(this.game, m, this.portraits));
		this.addChild(this.charactersRenderer);

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

	activateInternal() {
		this.container = this.addElement('div', 'party paper flex-1');
		this.container.addEventListener('click', (e) => {
			e.stopPropagation();
			e.preventDefault();
		});

		this.inner = Pixies.createElement(this.container, 'div', 'inner row stretch');
		this.portraits = Pixies.createElement(this.inner, 'div', 'portraits');
		this.inventory = Pixies.createElement(this.inner, 'div', 'inventory-wrapper');



	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
