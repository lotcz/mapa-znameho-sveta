import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class MapMenuRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;


	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;


	}

	activateInternal() {
		this.container = this.addElement('div', 'map-menu');
		Pixies.emptyElement(this.container);
		const buttons = Pixies.createElement(this.container, 'div', 'buttons');
		const start = Pixies.createElement(buttons, 'button', null, 'Start/Stop', () => {
			this.game.saveGame.get().partyTraveling.set(!this.game.saveGame.get().partyTraveling.get());
		});
		const revert = Pixies.createElement(buttons, 'button', null, 'Revert', () => {
			this.game.saveGame.get().forward.set(!this.game.saveGame.get().forward.get());
		});
	}

	deactivateInternal() {
		Pixies.destroyElement(this.container);
	}

}
