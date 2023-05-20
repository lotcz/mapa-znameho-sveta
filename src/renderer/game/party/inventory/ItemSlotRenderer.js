import Pixies from "../../../../class/basic/Pixies";
import DomRendererWithSaveGame from "../../../basic/DomRendererWithSaveGame";

export default class ItemSlotRenderer extends DomRendererWithSaveGame {

	/**
	 * @type ItemSlotModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', ['slot', this.model.name]);
		this.container.addEventListener('click', () => {
			this.saveGame.triggerEvent('item-slot-selected', this.model);
		});

		this.inner = Pixies.createElement(this.container, 'div', 'inner');
		this.renderItem();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		if (this.model.item.isDirty) {
			this.renderItem();
		}
	}

	renderItem() {
		Pixies.emptyElement(this.inner);
		if (this.model.item.isSet()) {
			const item = this.model.item.get();
			const defId = item.definitionId.get();
			const itemDef = this.game.resources.itemDefinitions.getById(defId);
			if (!itemDef) {
				console.error(`Item definition ${defId} not found`);
				return;
			}
			this.game.assets.getAsset(`itm/${itemDef.id.get()}`, (img) => {
				this.img = img.cloneNode(true);
				this.img.setAttribute('draggable', false);
				Pixies.emptyElement(this.inner);
				this.inner.appendChild(this.img);
			});
		}
	}

}
