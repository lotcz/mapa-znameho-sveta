import Pixies from "../../../../class/basic/Pixies";
import PortraitStatRenderer from "./PortraitStatRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";
import DomRendererWithSaveGame from "../../../basic/DomRendererWithSaveGame";
import ImageRenderer from "../../../basic/ImageRenderer";
import DirtyValueRenderer from "../../../basic/DirtyValueRenderer";

export default class CharacterPortraitRenderer extends DomRendererWithSaveGame {

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
		this.container = this.addElement('div', 'character column');
		this.container.addEventListener('click', () => this.saveGame.party.triggerEvent('character-selected', this.model.id.get()));
		this.container.addEventListener('mouseover', () => {
			this.saveGame.triggerEvent('character-hover', this.model);
		});
		this.container.addEventListener('mouseout', () => {
			this.saveGame.triggerEvent('character-hover', null);
		});

		this.top = Pixies.createElement(this.container, 'div', 'row');
		this.portrait = Pixies.createElement(this.top, 'div', 'portrait');
		this.addChild(new ImageRenderer(this.game, this.model.portrait, this.portrait));

		this.stats = Pixies.createElement(this.top, 'div', 'stats');
		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.basic.all,
				(m) => new PortraitStatRenderer(this.game, m, this.stats)
			)
		);

		this.bottom = Pixies.createElement(this.container, 'div', 'center');
		this.name = Pixies.createElement(this.bottom, 'div');
		this.addChild(new DirtyValueRenderer(this.game, this.model.name, this.name, Pixies.extractWord));
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

}
