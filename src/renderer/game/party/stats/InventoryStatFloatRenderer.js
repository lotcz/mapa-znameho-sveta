import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class InventoryStatFloatRenderer extends DomRenderer {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'column flex-1');
		this.name = Pixies.createElement(this.container, 'div');
		this.bottom = Pixies.createElement(this.container, 'div', 'row');
		this.numeric = Pixies.createElement(this.bottom, 'div', 'm-1');
		this.progress = Pixies.createElement(this.bottom, 'div', 'stat-bar flex-1 m-1 row stretch');
		this.bar = Pixies.createElement(this.progress, 'div', `stat-${this.model.definitionId.get()}`);

		this.statDef = this.game.resources.statDefinitions.getById(this.model.definitionId.get());
		this.updateStat();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		this.updateStat();
	}

	updateStat() {
		if (!this.statDef) {
			console.log('stat def not found', this.model.definitionId.get());
			return;
		}
		this.name.innerText = this.statDef.name.get();
		this.numeric.innerText = `${Pixies.round(this.model.currentFloat.get(), 1)} / ${this.model.baseValue.get()}`;
		const ratio = this.model.currentFloat.get() / this.model.baseValue.get();
		const width = Pixies.round(ratio * 100, 3);
		this.bar.style.width = `${width}%`;
	}

}
