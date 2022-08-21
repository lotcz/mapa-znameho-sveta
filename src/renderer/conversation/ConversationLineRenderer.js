import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";

export default class ConversationLineRenderer extends DomRenderer {

	/**
	 * @type RunningConversationLineModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.container = null;
		this.portrait = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'line');

		let portrait = null;

		if (this.model.isResponse.get()) {
			Pixies.addClass(this.container, 'response');
			if (this.model.runningEntry.characterResponding) {
				portrait = this.model.runningEntry.characterResponding.portrait.get();
			}
		} else if (!this.model.line.isNarrator.get()) {
			portrait = this.model.runningConversation.getPortrait();
		}

		if (portrait) {
			this.portrait = Pixies.createElement(this.container, 'div', 'portrait');
			this.game.assets.getAsset(portrait, (img) => this.portrait.appendChild(img.cloneNode(false)));
		}

		this.text = Pixies.createElement(this.container, 'div', 'text');
		this.text.innerText = this.model.line.text.get();

		if (this.game.isInDebugMode.get()) {
			if (this.model.isResponse.get()) {
				Pixies.magicEditor(this.text, (value) => this.model.runningEntry.originalEntry.responseText.set(value));
			} else {
				this.buttons = Pixies.createElement(this.container, 'div', 'buttons');

				this.narrator = Pixies.createElement(this.buttons, 'input');
				this.narrator.setAttribute('type', 'checkbox');
				this.narrator.checked = this.model.line.isNarrator.get();
				this.narrator.addEventListener('change', () => {
					this.model.line.isNarrator.set(this.narrator.checked);
				});

				Pixies.magicEditor(this.text, (value) => this.model.line.text.set(value));

				this.del = Pixies.createElement(this.buttons, 'button');
				this.del.innerText = 'del';
				this.del.addEventListener('click', () => {
					if (confirm('Delete line "' + this.model.line.text.get() + '" ?')) {
						this.model.runningEntry.lines.remove(this.model);
						this.model.runningEntry.originalEntry.lines.remove(this.model.line);
					}
				});
			}
		}
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
