import DomRenderer from "./DomRenderer";
import Pixies from "../../class/basic/Pixies";
import DirtyValueRenderer from "./DirtyValueRenderer";

export default class TooltipRenderer extends DomRenderer {

	/**
	 * @type DirtyValue
	 */
	model;

	/**
	 * @type StringValue
	 */
	tooltip;

	constructor(game, model, tooltip, dom) {
		super(game, model, dom);

		this.model = model;
		this.tooltip = tooltip;
		this.container = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'with-tooltip');
		this.content = Pixies.createElement(this.container, 'div', 'content');
		this.addChild(new DirtyValueRenderer(this.game, this.model, this.content));
		this.tt = Pixies.createElement(this.container, 'div', 'tooltip');
		this.addChild(new DirtyValueRenderer(this.game, this.tooltip, this.tt));
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

}
