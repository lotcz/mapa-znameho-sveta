import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/game/SaveGameModel";

export default class EditorSaveGameMenuRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.container = null;

		this.addAutoEvent(
			this.model.mode,
			'change',
			() => this.updateMode(),
			true
		);

	}

	activateInternal() {
		this.container = this.addElement('div', 'editor-save-game col');
		this.buttons = Pixies.createElement(this.container, 'div', 'buttons row');
		this.buttonsLeft = Pixies.createElement(this.buttons, 'div', 'row');
		this.buttonsRight = Pixies.createElement(this.buttons, 'div',  'row');

		Pixies.createElement(
			this.buttonsLeft,
			'button',
			null,
			'Save',
			() => this.model.triggerEvent('save')
		);
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	updateMode() {
		Pixies.emptyElement(this.buttonsRight);

		Pixies.createElement(
			this.buttonsRight,
			'button',
			this.model.mode.equalsTo(GAME_MODE_MAP) ? 'active' : null,
			'MAP',
			() => this.model.triggerEvent('switch-mode-map')
		);

		Pixies.createElement(
			this.buttonsRight,
			'button',
			this.model.mode.equalsTo(GAME_MODE_BATTLE) ? 'active' : null,
			'BATTLE',
			() => this.model.triggerEvent('switch-mode-battle')
		);
	}

}
