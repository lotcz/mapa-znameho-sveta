import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";

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
		this.container = this.addElement('div', 'slot');
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
			const modelId = this.model.item.get().modelId.get();
			const model = this.game.resources.models3d.getById(modelId);
			this.game.assets.getAsset(`itm/${model.uri.get()}`, (img) => {
				this.inner.appendChild(img.cloneNode(true));
			});
		}
	}

}
