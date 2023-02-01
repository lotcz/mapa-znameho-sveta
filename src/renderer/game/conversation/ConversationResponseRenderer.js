import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";
import TableLookupRenderer from "../../editor/TableLookupRenderer";

export default class ConversationResponseRenderer extends DomRenderer {

	/**
	 * @type ConversationEntryModel
	 */
	model;

	/**
	 * @type ConversationEntryModel
	 */
	parentEntry;

	constructor(game, model, dom, parentEntry) {
		super(game, model, dom);

		this.model = model;
		this.parentEntry = parentEntry;
		this.container = null;

	}

	activateInternal() {
		if (this.model === this.parentEntry) return;

		this.container = this.addElement('div', 'response row');
		this.link = Pixies.createElement(this.container, 'a');
		this.link.innerText = this.model.responseText.get();

		this.link.addEventListener('click', () => {
			this.game.saveGame.get().conversation.get().currentEntry.set(this.model);
		});

		if (this.game.isInDebugMode.get()) {
			this.editorSection = Pixies.createElement(this.container, 'div', 'editor-section');
			this.del = Pixies.createElement(this.editorSection, 'button');
			this.del.innerText = 'del';
			this.del.addEventListener('click', () => {
				if (confirm('Delete response ' + this.model.responseText.get() + '?')) {
					this.parentEntry.entries.remove(this.model);
				}
			});
			Pixies.createElement(this.editorSection, 'button', null, 'requires', (e) => {
				e.preventDefault();
				const lookupRenderer = new TableLookupRenderer(this.game, this.model.requiresStageId, this.container, 'requiresStageId');
				this.model.requiresStageId.addEventListener('table-closed', () => {
					lookupRenderer.deactivate();
				});
				lookupRenderer.activate();
			});
			Pixies.createElement(this.editorSection, 'button', null, 'completes', (e) => {
				e.preventDefault();
				const lookupRenderer = new TableLookupRenderer(this.game, this.model.completesStageId, this.container, 'completesStageId');
				this.model.completesStageId.addEventListener('table-closed', () => {
					lookupRenderer.deactivate();
				});
				lookupRenderer.activate();
			});
		}
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
