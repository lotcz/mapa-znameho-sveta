import Pixies from "../../../class/basic/Pixies";
import DomRendererWithBattle from "../../basic/DomRendererWithBattle";

export default class BattleFightingMenuRenderer extends DomRendererWithBattle {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.container = this.addElement('div', 'column');

		this.buttons = Pixies.createElement(this.container, 'div', 'buttons row');

		const start = Pixies.createElement(this.buttons, 'button', null, 'Fighting', () => {
			this.model.partyTraveling.invert();
		});

	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
