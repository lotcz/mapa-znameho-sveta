import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class StatFloatRenderer extends DomRenderer {

	/**
	 * @type StatFloatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.container = null;
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'stat-bar');
		this.bar = Pixies.createElement(this.container, 'div', `stat-${this.model.definitionId.get()}`);
		this.updateBar();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		this.updateBar();
	}

	updateBar() {
		const ratio = this.model.getCurrentPortion();
		this.bar.style.height = `${Pixies.round(ratio * 100, 2)}%`;
	}
}
