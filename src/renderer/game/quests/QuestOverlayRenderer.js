import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class QuestOverlayRenderer extends DomRenderer {

	/**
	 * @type QuestOverlayModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div','completed-quest');
		this.addClass('container');
		Pixies.toggleClass(this.dom, 'is-chapter', this.model.quest.isChapter.get());
		Pixies.createElement(this.container, 'div', 'quest-title', this.model.quest.name.get());
		Pixies.createElement(this.container, 'div', 'quest-text', this.model.quest.text.get());
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.removeClass('container');
		this.removeClass('is-chapter');
	}

	renderInternal() {
		this.container.style.opacity = this.model.opacity.get();
	}
}
