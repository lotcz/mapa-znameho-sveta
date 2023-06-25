import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class ExitTooltipRenderer extends DomRenderer {

	/**
	 * @type BattleSpecialModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);
		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'tooltip-race');

		const top = Pixies.createElement(this.container, 'div', 'top p-1');
		const name = Pixies.createElement(top, 'h3', 'name pt-1', 'Východ');

	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
