import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class ConversationLineRenderer extends DomRenderer {

	/**
	 * @type ConversationLineModel
	 */
	model;

	/**
	 * @type ConversationEntryModel
	 */
	entry;

	constructor(game, model, dom, entry) {
		super(game, model, dom);

		this.model = model;
		this.entry = entry;

		this.container = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'line row');

		let portraitUri = null;

		if (!this.model.isNarrator.get()) {
			portraitUri = this.model.portrait.get();
		}

		if (portraitUri) {
			const portrait = Pixies.createElement(this.container, 'div', 'portrait');
			this.game.assets.getAsset(portraitUri, (img) => portrait.appendChild(img.cloneNode(false)));
		}

		this.text = Pixies.createElement(this.container, 'div', 'text flex-1');
		this.text.innerHTML = Pixies.paragraphize(this.model.text.get());

		if (this.game.isInDebugMode.get()) {
			this.buttons = Pixies.createElement(this.container, 'div', 'buttons editor-section');

			this.narrator = Pixies.createElement(this.buttons, 'input');
			this.narrator.setAttribute('type', 'checkbox');
			this.narrator.checked = this.model.isNarrator.get();
			this.narrator.addEventListener('change', () => {
				this.model.isNarrator.set(this.narrator.checked);
			});

			Pixies.magicEditor(this.text, (value) => this.model.text.set(value));

			this.del = Pixies.createElement(this.buttons, 'button');
			this.del.innerText = 'del';
			this.del.addEventListener('click', () => {
				if (confirm('Delete line "' + this.model.text.get() + '" ?')) {
					this.entry.lines.remove(this.model);
				}
			});

		}

		this.updateLineText();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		if (this.model.text.isDirty || this.model.isNarrator.isDirty) {
			this.updateLineText();
		}
	}

	updateLineText() {
		this.text.innerHTML = Pixies.paragraphize(this.model.text.get());
		if (this.model.isNarrator.get()) {
			Pixies.addClass(this.container, 'narrator');
		} else {
			Pixies.removeClass(this.container, 'narrator');
		}
	}
}
