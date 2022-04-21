import Pixies from "../../class/basic/Pixies";
import RendererNode from "./RendererNode";

export default class DomRenderer extends RendererNode {
	dom;

	constructor(game, model, dom) {
		super(game, model);
		this.dom = dom;
	}

	addClass(css) {
		Pixies.addClass(this.dom, css);
	}

	removeClass(css) {
		Pixies.removeClass(this.dom, css);
	}

	addElement(tag, css = null) {
		return Pixies.createElement(this.dom, tag, css);
	}

	removeElement(el) {
		Pixies.destroyElement(el);
	}

}
