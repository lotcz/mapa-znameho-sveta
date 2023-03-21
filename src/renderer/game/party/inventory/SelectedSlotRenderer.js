import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import {IMAGE_SIZE} from "./InventoryImageHelper";

export default class SelectedSlotRenderer extends DomRenderer {

	/**
	 * @type ItemSlotModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addAutoEvent(
			this.game.controls.mouseCoordinates,
			'change',
			() => this.updatePosition(),
			true
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'selected-item-slot');
		this.img = null;
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
		Pixies.emptyElement(this.container);
		if (this.model.item.isSet()) {
			const item = this.model.item.get();
			const defId = item.definitionId.get();
			const itemDef = this.game.resources.itemDefinitions.getById(defId);
			this.game.assets.getAsset(`itm/${itemDef.id.get()}`, (img) => {
				this.img = img.cloneNode(true);
				this.img.setAttribute('draggable', false);
				this.container.appendChild(this.img);
			});
		}
		this.updatePosition();
	}

	updatePosition() {
		const position = this.game.controls.mouseCoordinates;
		const offset = IMAGE_SIZE.multiply(-0.5);
		this.container.style.left = `${position.x + offset.x}px`;
		this.container.style.top = `${position.y + offset.y}px`;
	}

}
