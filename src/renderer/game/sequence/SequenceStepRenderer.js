import DomRenderer from "../../basic/DomRenderer";

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
		this.dom.innerText = this.model.text.get();
	}

}
