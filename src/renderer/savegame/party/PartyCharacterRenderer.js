import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

export default class PartyCharacterRenderer extends DomRenderer {

	/**
	 * @type CharacterModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.container = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'character');

		this.container.addEventListener('click', () => this.game.saveGame.get().party.triggerEvent('character-selected', this.model.id.get()));

		this.renderPortrait();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		if (this.model.portrait.isDirty || this.model.name.isDirty) {
			this.renderPortrait();
		}
	}

	renderPortrait() {
		Pixies.emptyElement(this.container);
		let portraitUri = this.model.portrait.get();

		if (portraitUri) {
			const portrait = Pixies.createElement(this.container, 'div', 'portrait');
			this.game.assets.getAsset(portraitUri, (img) => portrait.appendChild(img.cloneNode(true)));
		}

		this.text = Pixies.createElement(this.container, 'div', 'text');
		this.text.innerText = this.model.name.get();
	}
}
