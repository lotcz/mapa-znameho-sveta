import DomRenderer from "../../basic/DomRenderer";
import CollectionRenderer from "../../basic/CollectionRenderer";
import PartyCharacterRenderer from "./PartyCharacterRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class PartyRenderer extends DomRenderer {

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

		this.charactersRenderer = new CollectionRenderer(this.game, this.model.characters, (model) => new PartyCharacterRenderer(this.game, model, this.inner));
		this.addChild(this.charactersRenderer);

	}

	activateInternal() {
		this.container = this.addElement('div', 'party');
		this.inner = Pixies.createElement(this.container, 'div', 'inner');
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}


}
