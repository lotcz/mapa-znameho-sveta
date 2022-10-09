import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class InventoryCombatStatRenderer extends DomRenderer {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'column flex-1 p-1');
		this.name = Pixies.createElement(this.container, 'div');
		this.bottom = Pixies.createElement(this.container, 'div', 'row');
		this.numeric = Pixies.createElement(this.bottom, 'div');

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
		this.numeric.innerText = this.model.current.get();
	}

}
