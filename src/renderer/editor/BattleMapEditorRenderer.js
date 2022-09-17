import Pixies from "../../class/basic/Pixies";
import DomRenderer from "../basic/DomRenderer";

export default class NodeTableRenderer extends DomRenderer {

	/**
	 * @type BattleMapModel
	 */
	model;

	name;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.dom = dom;
		this.container = null;

	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'battle-menu bg');

		this.buttons = Pixies.createElement(this.container, 'div', 'buttons');
		const buttonsLeft = Pixies.createElement(this.buttons, 'div');
		const buttonsRight = Pixies.createElement(this.buttons, 'div');

		Pixies.createElement(
			buttonsLeft,
			'button',
			null,
			'Add Sprite',
			(e) => {
				e.preventDefault();
				const sprite = null;
				this.game.editor.activeBattleSprite.set(this.model.add());
			}
		);
	}

	deactivateInternal() {
		Pixies.destroyElement(this.container);
	}

}
