import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class InventoryStatNumberRenderer extends DomRenderer {

	/**
	 * @type FloatValue|IntValue
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'row center');
		this.wholePart = Pixies.createElement(this.container, 'div');
		this.decimalPart = Pixies.createElement(this.container, 'div', 'small');
		this.updateNumber();
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.container = null;
	}

	renderInternal() {
		this.updateNumber();
	}

	updateNumber() {
		const raw = Pixies.round(this.model.get(), 1);
		const whole = Math.floor(raw);
		const decimal = raw - whole;
		this.wholePart.innerText = whole;
		this.decimalPart.innerText = (decimal > 0) ? `.${Math.round(decimal * 10)}` : '';
	}

}
