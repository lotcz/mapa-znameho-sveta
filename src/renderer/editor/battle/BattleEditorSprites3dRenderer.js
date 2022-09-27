import Pixies from "../../../class/basic/Pixies";
import DomRenderer from "../../basic/DomRenderer";
import TableLookupRenderer from "../TableLookupRenderer";

export default class BattleEditorSprites3dRenderer extends DomRenderer {

	/**
	 * @type BattleEditorModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;

		this.addAutoEvent(
			this.model.sprite3dId,
			'change',
			() => this.spriteId.value = this.model.sprite3dId.get(),
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
				const lookupRenderer = new TableLookupRenderer(this.game, this.model.sprite3dId, this.dom, 'sprite3dId');
				this.model.sprite3dId.addEventListener('table-closed', () => {
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
