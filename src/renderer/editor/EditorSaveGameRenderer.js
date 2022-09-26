import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/game/SaveGameModel";
import ConditionalNodeRenderer from "../basic/ConditionalNodeRenderer";
import BattleEditorRenderer from "./battle/BattleEditorRenderer";

export default class EditorSaveGameRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom, buttons) {
		super(game, model, dom);

		this.model = model;
		this.buttons = buttons;
		this.container = null;

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.model.mode,
				() => this.model.mode.equalsTo(GAME_MODE_BATTLE),
				() => new BattleEditorRenderer(this.game, this.game.editor.battleEditor, this.dom)
			)
		);

		this.addAutoEvent(
			this.model.mode,
			'change',
			() => this.updateMode(),
			true
		);

	}

	activateInternal() {
		this.container = Pixies.createElement(this.buttons, 'div', 'editor-save-game col');
		const buttons = Pixies.createElement(this.container, 'div', 'buttons row');
		this.buttonsLeft = Pixies.createElement(buttons, 'div', 'row');
		this.buttonsRight = Pixies.createElement(buttons, 'div',  'row');

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
