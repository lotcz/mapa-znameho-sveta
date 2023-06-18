import Pixies from "../../../class/basic/Pixies";
import TableLookupRenderer from "../../editor/TableLookupRenderer";
import DomRendererWithSaveGame from "../../basic/DomRendererWithSaveGame";

export default class ConversationResponseRenderer extends DomRendererWithSaveGame {

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

		if (!(this.model.isResponseAvailable.get() || this.game.isInDebugMode.get())) return;

		this.container = this.addElement('div', 'response column');
		this.link = Pixies.createElement(
			this.container,
			'a',
			null,
			this.model.responseText.get(),
			() => this.saveGame.conversation.get().currentEntry.set(this.model)
		);

		this.renderInternal();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {

		if (!(this.model.isResponseAvailable.get() || this.game.isInDebugMode.get())) return;

		if (this.game.isInDebugMode.get()) {
			if (!this.editorSection) {
				this.editorSection = Pixies.createElement(this.container, 'div', 'editor-section');
			}
			this.editorSection.innerText = '';
			this.del = Pixies.createElement(this.editorSection, 'button', null, 'del', () => {
				if (confirm('Delete response ' + this.model.responseText.get() + '?')) {
					this.parentEntry.entries.remove(this.model);
				}
			});
			Pixies.createElement(this.editorSection, 'button', null, `requires:${this.model.requiresStageId.toString()}`, (e) => {
				e.preventDefault();
				const lookupRenderer = new TableLookupRenderer(this.game, this.model.requiresStageId, this.container, 'requiresStageId');
				this.model.requiresStageId.addEventListener('table-closed', () => {
					lookupRenderer.deactivate();
				});
				lookupRenderer.activate();
			});
			Pixies.createElement(this.editorSection, 'button', null, `completes:${this.model.completesStageId.toString()}`, (e) => {
				e.preventDefault();
				const lookupRenderer = new TableLookupRenderer(this.game, this.model.completesStageId, this.container, 'completesStageId');
				this.model.completesStageId.addEventListener('table-closed', () => {
					lookupRenderer.deactivate();
				});
				lookupRenderer.activate();
			});
			Pixies.createElement(this.editorSection, 'button', null, `hidden:${this.model.hiddenByStageId.toString()}`, (e) => {
				e.preventDefault();
				const lookupRenderer = new TableLookupRenderer(this.game, this.model.hiddenByStageId, this.container, 'hiddenByStageId');
				this.model.hiddenByStageId.addEventListener('table-closed', () => {
					lookupRenderer.deactivate();
				});
				lookupRenderer.activate();
			});
			Pixies.createElement(this.editorSection, 'button', null, `gives:${this.model.givesItemId.toString()}`, (e) => {
				e.preventDefault();
				const lookupRenderer = new TableLookupRenderer(this.game, this.model.givesItemId, this.container, 'givesItemId');
				this.model.givesItemId.addEventListener('table-closed', () => {
					lookupRenderer.deactivate();
				});
				lookupRenderer.activate();
			});
			Pixies.createElement(this.editorSection, 'button', null, `req item:${this.model.requiresItemId.toString()}`, (e) => {
				e.preventDefault();
				const lookupRenderer = new TableLookupRenderer(this.game, this.model.requiresItemId, this.container, 'requiresItemId');
				this.model.requiresItemId.addEventListener('table-closed', () => {
					lookupRenderer.deactivate();
				});
				lookupRenderer.activate();
			});
		}
	}

}
