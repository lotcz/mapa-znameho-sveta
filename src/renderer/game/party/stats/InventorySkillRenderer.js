import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class InventorySkillRenderer extends DomRenderer {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.statDef = null;
	}

	activateInternal() {
		this.container = this.addElement( 'div', 'row stat');

		this.name = Pixies.createElement(this.container, 'div', 'flex-1');
		this.value = Pixies.createElement(this.container, 'div', 'row');
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
			console.log('stat def empty', this.model.definitionId.get());
			return;
		}

		this.name.innerText = `${this.statDef.name.get()} - ${Pixies.round(this.model.currentFloat.get(), 2)}`;

		const max = this.statDef.max.get();
		const base = this.model.baseValue.get();
		const current = this.model.current.get();
		Pixies.emptyElement(this.value);
		for (let i = 0; i < max; i++) {
			const brick = Pixies.createElement(this.value, 'div', 'stat-brick');
			if (i < current) {
				if (i >= base) {
					Pixies.addClass(brick, 'extra');
				} else {
					Pixies.addClass(brick, 'normal');
				}
			} else if (i < base) {
				Pixies.addClass(brick, 'loss');
			}
		}
	}
}
