import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import PortraitStatRenderer from "./PortraitStatRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";

export default class CharacterPortraitRenderer extends DomRenderer {

	/**
	 * @type CharacterModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.basic.all,
				(m) => new PortraitStatRenderer(this.game, m, this.stats)
			)
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'character');
		this.container.addEventListener('click', () => this.game.saveGame.get().party.triggerEvent('character-selected', this.model.id.get()));

		this.portraitWrapper = Pixies.createElement(this.container, 'div');
		this.renderPortrait();

		this.stats = Pixies.createElement(this.container, 'div', 'stats');
		/*
		this.addChild(new PortraitStatRenderer(this.game, this.model.stats.basic.health, this.stats));
		this.addChild(new PortraitStatRenderer(this.game, this.model.stats.basic.stamina, this.stats));
*/
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

		this.text = Pixies.createElement(this.portraitWrapper, 'div', 'text center');
		this.text.innerText = this.model.name.get();
	}

}
