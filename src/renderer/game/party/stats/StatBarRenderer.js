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
		if (this.model.definition.isEmpty()) return;
		//const statDef = this.model.definition.get();
		const max = this.model.baseValue.get();
		const ratio = max > 0 ? this.model.currentFloat.get() / max : 0;
		const width = Pixies.round(ratio * 100, 3);
		this.bar.style.width = `${Pixies.between(0, 100, width)}%`;
		this.bar.style.opacity = Pixies.between(0.1, 1, ratio);
	}

}
