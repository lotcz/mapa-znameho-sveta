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
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'row');

		this.name = Pixies.createElement(this.container, 'div',  'flex-1');
		this.value = Pixies.createElement(this.container, 'div');
		this.updateStat();

		const statDef = this.game.resources.statDefinitions.getById(this.model.definitionId.get());
		if (!statDef) {
			console.log('stat def not found', this.model.definitionId.get());
			return;
		}
		this.name.innerText = `${statDef.name.get()} - max. ${statDef.max.get()}`;

	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		this.updateStat();
	}

	updateStat() {
		this.value.innerText = `${this.model.current.get()}/${this.model.baseValue.get()}`
	}
}
