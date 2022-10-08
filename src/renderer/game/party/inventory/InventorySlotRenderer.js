import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class InventorySlotRenderer extends DomRenderer {

	/**
	 * @type InventorySlotModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;


	}

	activateInternal() {
		this.container = this.addElement('div', ['slot', this.model.name]);
		this.container.addEventListener('click', () => {
			this.game.saveGame.get().triggerEvent('item-slot-selected', this.model);
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
			this.game.assets.getAsset(`itm/${itemDef.id.get()}`, (img) => {
				Pixies.emptyElement(this.inner);
				this.inner.appendChild(img.cloneNode(true));
			});
		}
	}

}
