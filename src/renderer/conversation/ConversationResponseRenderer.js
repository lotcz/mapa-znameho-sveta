import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";

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
		this.container = this.addElement('div', 'response');
		this.link = Pixies.createElement(this.container, 'a');
		this.link.innerText = this.model.responseText.get();

		this.link.addEventListener('click', () => {
			this.game.saveGame.get().conversation.get().currentEntry.set(this.model);
		});

		if (this.game.isInDebugMode.get()) {
			this.del = Pixies.createElement(this.container, 'button');
			this.del.innerText = 'del';
			this.del.addEventListener('click', () => {
				if (confirm('Delete response ' + this.model.responseText.get() + '?')) {
					this.parentEntry.entries.remove(this.model);
				}
			});
		}
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
