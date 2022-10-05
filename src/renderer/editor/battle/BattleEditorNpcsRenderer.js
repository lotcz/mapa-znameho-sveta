import Pixies from "../../../class/basic/Pixies";
import DomRenderer from "../../basic/DomRenderer";
import TableLookupRenderer from "../TableLookupRenderer";

export default class BattleEditorNpcsRenderer extends DomRenderer {

	/**
	 * @type BattleEditorModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;

		this.addAutoEvent(
			this.model.characterTemplateId,
			'change',
			() => this.input.value = this.model.characterTemplateId.get(),
			true
		);
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'column');

		const frm = Pixies.createElement(this.container, 'div');
		const itm = Pixies.createElement(frm, 'div');
		this.input = Pixies.createElement(itm, 'input');
		this.input.setAttribute('type', 'text');

		Pixies.createElement(
			itm,
			'button',
			'lookup-button',
			'Select...',
			(e) => {
				e.preventDefault();
				const lookupRenderer = new TableLookupRenderer(this.game, this.model.characterTemplateId, this.dom, 'characterTemplateId');
				this.model.characterTemplateId.addEventListener('table-closed', () => {
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
