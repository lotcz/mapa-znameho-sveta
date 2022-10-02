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

		this.charactersRenderer = new CollectionRenderer(this.game, this.model.slots, (m) => new PartySlotRenderer(this.game, m, this.inner));
		this.addChild(this.charactersRenderer);

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.model.isInventoryVisible,
				() => this.model.isInventoryVisible.get(),
				() => new NullableNodeRenderer(
					this.game,
					this.model.selectedCharacter,
					(m) => new InventoryRenderer(this.game, m, this.topLayer)
				)
			)
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'party flex-1');
		this.inner = Pixies.createElement(this.container, 'div', 'inner');

		this.container.addEventListener('click', (e) => {
			e.stopPropagation();
			e.preventDefault();
		});
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
