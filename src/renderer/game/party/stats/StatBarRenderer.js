import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class StatBarRenderer extends DomRenderer {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
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
		if (this.model.currentFloat.isDirty || this.model.baseValue.isDirty) {
			this.updateBar();
		}
	}

	updateBar() {
		const ratio = this.model.baseValue.get() > 0 ? this.model.currentFloat.get() / this.model.baseValue.get() : 1;
		const width = Pixies.round(ratio * 100, 3);
		this.bar.style.width = `${Pixies.between(0, 100, width)}%`;
		this.bar.style.opacity = Pixies.between(0.1, 1, ratio);
	}

}
