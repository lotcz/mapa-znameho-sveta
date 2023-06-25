import CollectionRenderer from "../../basic/CollectionRenderer";
import DomRendererWithBattle from "../../basic/DomRendererWithBattle";
import ItemSlotRenderer from "../party/inventory/ItemSlotRenderer";

export default class BattleGroundSlotsRenderer extends DomRendererWithBattle {

	/**
	 * @type BattleModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.groundSlots.slots,
				(m) => new ItemSlotRenderer(this.game, m, this.container)
			)
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'inventory-slots-container');
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
