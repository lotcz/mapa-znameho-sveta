import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class StatTooltipRenderer extends DomRenderer {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);
		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'tooltip-stat');

		const def = this.model.definition.isSet() ?
			this.model.definition.get() :
			this.game.resources.statDefinitions.getById(this.model.definitionId.get());

		const top = Pixies.createElement(this.container, 'div', 'top p-1');
		const name = Pixies.createElement(top, 'h3', 'name pt-1', def.name.get());

		const bottom = Pixies.createElement(this.container, 'div', 'bottom p-1');
		const desc = Pixies.createElement(bottom, 'div', 'name left p-1', def.description.get());


	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
