import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
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
				this.model.currentBattle,
				() => this.model.currentBattle.isSet(),
				() => new BattleEditorRenderer(this.game, this.game.editor.battleEditor, this.dom)
			)
		);

		this.addAutoEvent(
			this.model.currentBattle,
			'change',
			() => this.updateMode(),
			true
		);

	}

	activateInternal() {
		this.container = Pixies.createElement(this.buttons, 'div', 'editor-save-ui col');
		const buttons = Pixies.createElement(this.container, 'div', 'buttons row');
		this.buttonsLeft = Pixies.createElement(buttons, 'div', 'row');
		this.buttonsRight = Pixies.createElement(buttons, 'div',  'row');

		Pixies.createElement(
			this.buttonsLeft,
			'button',
			null,
			'Save',
			() => this.game.triggerEvent('save-ui')
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
			this.model.currentBattle.isEmpty() ? 'active' : null,
			'MAP',
			() => this.model.triggerEvent('to-map')
		);

		Pixies.createElement(
			this.buttonsRight,
			'button',
			this.model.currentBattle.isSet() ? 'active' : null,
			'BATTLE',
			() => this.model.triggerEvent('to-battle')
		);
	}

}
