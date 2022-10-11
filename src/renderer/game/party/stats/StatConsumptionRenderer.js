import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class StatConsumptionRenderer extends DomRenderer {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'stat-wrapper column mb-1');
		this.top = Pixies.createElement(this.container, 'div', 'row center');
		this.name = Pixies.createElement(this.top, 'div', 'stat-name');

		this.bottom = Pixies.createElement(this.container, 'div', 'row');
		this.progress = Pixies.createElement(this.bottom, 'div', 'stat-bar flex-1 row stretch');
		this.bar = Pixies.createElement(this.progress, 'div', `stat-${this.model.definitionId.get()}`);

		this.statDef = this.game.resources.statDefinitions.getById(this.model.definitionId.get());
		if (!this.statDef) {
			console.log('stat def not found', this.model.definitionId.get());
			return;
		}
		this.name.innerText = this.statDef.name.get();
		this.updateStat();
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

	renderInternal() {
		if (this.model.currentFloat.isDirty || this.model.baseValue.isDirty) {
			this.updateStat();
		}
	}

	updateStat() {
		const ratio = this.model.currentFloat.get() / this.model.baseValue.get();
		const width = Pixies.round(ratio * 100, 3);
		this.bar.style.width = `${Pixies.between(0, 100, width)}%`;
		const opacity = Pixies.between(0.1, 1, ratio);
		this.bar.style.opacity = opacity;
	}

}
