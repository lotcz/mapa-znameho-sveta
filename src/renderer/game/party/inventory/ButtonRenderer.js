import Pixies from "../../../../class/basic/Pixies";
import DomRenderer from "../../../basic/DomRenderer";

export default class ButtonRenderer extends DomRenderer {

	constructor(game, model, dom, label, onClick) {
		super(game, model, dom);

		this.label = label;
		this.onClick = onClick;
	}

	activateInternal() {
		this.container = this.addElement('div');
		Pixies.createElement(this.container, 'button', null, this.label, this.onClick);
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.container = null;
	}

}
