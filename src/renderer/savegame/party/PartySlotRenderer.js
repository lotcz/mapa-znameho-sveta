import DomRenderer from "../../basic/DomRenderer";
import NullableNodeRenderer from "../../basic/NullableNodeRenderer";
import PartyCharacterRenderer from "./PartyCharacterRenderer";

export default class PartySlotRenderer extends DomRenderer {

	/**
	 * @type PartySlotModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;

		this.characterRenderer = new NullableNodeRenderer(this.game, this.model.character, (m) => new PartyCharacterRenderer(this.game, m, this.container));
		this.addChild(this.characterRenderer);
	}

	activateInternal() {
		this.container = this.addElement('div', 'slot');
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
