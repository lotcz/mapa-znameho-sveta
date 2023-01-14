import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class SequenceStepRenderer extends DomRenderer {

	/**
	 * @type SequenceStepModel
	 */
	model;

	constructor(game, model, bg, text) {
		super(game, model, bg);

		this.model = model;
		this.bg = bg;
		this.text = text;
	}

	activateInternal() {
		const text = this.model.text.get();
		if (text && text.length > 0) {
			Pixies.emptyElement(this.text);
			Pixies.removeClass(this.text, 'fading-out');
			Pixies.createElement(this.text,'div', null, text);
		} else {
			Pixies.addClass(this.text, 'fading-out');
		}
	}

	deactivateInternal() {
		//this.removeElement(this.container);
	}

}
