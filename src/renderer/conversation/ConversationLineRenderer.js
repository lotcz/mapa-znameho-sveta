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

		if (this.model.isResponse) {
			if (this.model.entry.characterResponding) {
				portrait = this.model.entry.characterResponding.portrait.get();
			}
		} else {
			portrait = this.model.conversation.getPortrait();
		}

		if (portrait) {
			this.portrait = Pixies.createElement(this.container, 'div', 'portrait');
			this.game.assets.getAsset(portrait, (img) => this.portrait.appendChild(img.cloneNode(false)));
		}

		this.text = Pixies.createElement(this.container, 'span');
		this.text.innerText = this.model.line.text.get();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
