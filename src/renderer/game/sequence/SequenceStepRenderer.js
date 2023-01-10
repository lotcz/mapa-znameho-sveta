import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class SequenceStepRenderer extends DomRenderer {

	/**
	 * @type SequenceStepModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		const text = this.model.text.get();
		if (text && text.length > 0) {
			Pixies.emptyElement(this.dom);
			Pixies.removeClass(this.dom, 'fading-out');
			this.container = this.addElement('div');
			this.container.innerText = text;
		} else {
			Pixies.addClass(this.dom, 'fading-out');
		}
	}

	deactivateInternal() {
		//this.removeElement(this.container);
	}

}
