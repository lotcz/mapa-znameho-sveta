import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class RaceTooltipRenderer extends DomRenderer {

	/**
	 * @type RaceModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);
		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'tooltip-race');

		const top = Pixies.createElement(this.container, 'div', 'top p-1');
		const name = Pixies.createElement(top, 'h3', 'name pt-1', this.model.name.get());

		const bottom = Pixies.createElement(this.container, 'div', 'bottom p-1');
		const desc = Pixies.createElement(bottom, 'div', 'name left p-1', this.model.description.get());

	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
