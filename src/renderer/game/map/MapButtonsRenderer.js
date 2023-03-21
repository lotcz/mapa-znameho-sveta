import DomRendererWithSaveGame from "../../basic/DomRendererWithSaveGame";
import Pixies from "../../../class/basic/Pixies";

export default class MapButtonsRenderer extends DomRendererWithSaveGame {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'map-menu ');

		this.buttons = Pixies.createElement(this.container, 'div', 'buttons column center');

		const start = Pixies.createElement(this.buttons, 'button', null, 'Start/Stop', () => {
			this.model.partyTraveling.invert();
		});
		const revert = Pixies.createElement(this.buttons, 'button', null, 'Revert', () => {
			this.model.forward.invert();
		});
		const sleep = Pixies.createElement(this.buttons, 'button', null, 'Sleep', () => {
			this.model.partyResting.set(0.4);
		});
		const battle = Pixies.createElement(this.buttons, 'button', 'special', 'To Battle', () => {
			this.model.triggerEvent('to-battle');
		});

	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
