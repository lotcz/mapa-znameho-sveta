import Pixies from "../../../class/basic/Pixies";
import DomRenderer from "../../basic/DomRenderer";
import TableLookupRenderer from "../TableLookupRenderer";

export default class BattleEditorSpritesRenderer extends DomRenderer {

	/**
	 * @type BattleEditorModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;

		this.addAutoEvent(
			this.model.spriteId,
			'change',
			() => this.spriteId.value = this.model.spriteId.get(),
			true
		);
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'column');

		const top = Pixies.createElement(this.container, 'div');
		const createSprite = Pixies.createElement(top, 'div');
		this.spriteId = Pixies.createElement(createSprite, 'input');
		this.spriteId.setAttribute('type', 'text');

		Pixies.createElement(
			createSprite,
			'button',
			'lookup-button',
			'Select...',
			(e) => {
				e.preventDefault();
				const lookupRenderer = new TableLookupRenderer(this.game, this.model.spriteId, this.dom, 'spriteId');
				this.model.spriteId.addEventListener('table-closed', () => {
					lookupRenderer.deactivate();
				});
				lookupRenderer.activate();
			}
		);

	}

	deactivateInternal() {
		Pixies.destroyElement(this.container);
	}

}
