import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import StatFloatRenderer from "../stats/StatFloatRenderer";

export default class PartyCharacterRenderer extends DomRenderer {

	/**
	 * @type CharacterModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.container = null;
		this.health = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'character');
		this.container.addEventListener('click', () => this.game.saveGame.get().party.triggerEvent('character-selected', this.model.id.get()));

		this.portraitWrapper = Pixies.createElement(this.container, 'div');
		this.renderPortrait();

		this.stats = Pixies.createElement(this.container, 'div', 'stats');
		this.addChild(new StatFloatRenderer(this.game, this.model.stats.health, this.stats));
		this.addChild(new StatFloatRenderer(this.game, this.model.stats.physical, this.stats));

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
		Pixies.emptyElement(this.portraitWrapper);
		let portraitUri = this.model.portrait.get();

		if (portraitUri) {
			const portrait = Pixies.createElement(this.portraitWrapper, 'div', 'portrait');
			this.game.assets.getAsset(portraitUri, (img) => portrait.appendChild(img.cloneNode(true)));
		}

		this.text = Pixies.createElement(this.portraitWrapper, 'div', 'text');
		this.text.innerText = this.model.name.get();
	}

}
