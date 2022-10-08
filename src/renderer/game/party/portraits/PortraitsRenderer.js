import DomRenderer from "../../../basic/DomRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";
import Pixies from "../../../../class/basic/Pixies";
import PartySlotRenderer from "./PartySlotRenderer";

export default class PortraitsRenderer extends DomRenderer {

	/**
	 * @type PartyModel
	 */
	model;

	/**
	 * @type CollectionRenderer
	 */
	charactersRenderer;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.charactersRenderer = new CollectionRenderer(this.game, this.model.slots, (m) => new PartySlotRenderer(this.game, m, this.container));
		this.addChild(this.charactersRenderer);

	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'column');
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.container = null;
	}

}
