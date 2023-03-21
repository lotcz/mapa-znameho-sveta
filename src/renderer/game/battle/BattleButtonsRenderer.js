import Pixies from "../../../class/basic/Pixies";
import CollectionRenderer from "../../basic/CollectionRenderer";
import DomRendererWithBattle from "../../basic/DomRendererWithBattle";
import ItemSlotRenderer from "../party/inventory/ItemSlotRenderer";

export default class BattleButtonsRenderer extends DomRendererWithBattle {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.battle.groundItems,
				(m) => new ItemSlotRenderer(this.game, m, this.items)
			)
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'map-menu column');

		this.buttons = Pixies.createElement(this.container, 'div', 'buttons column center');

		const start = Pixies.createElement(this.buttons, 'button', null, 'battle button', () => {
			this.model.partyTraveling.invert();
		});

		this.items = Pixies.createElement(this.container, 'div', 'inventory-slots-container');
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
