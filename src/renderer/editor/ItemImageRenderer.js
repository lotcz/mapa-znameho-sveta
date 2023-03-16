import Pixies from "../../class/basic/Pixies";
import GUIHelper from "../../class/basic/GUIHelper";
import DomRenderer from "../basic/DomRenderer";
import ItemInventoryImageHelper from "../game/party/inventory/InventoryImageHelper";

export default class ItemImageRenderer extends DomRenderer {

	/**
	 * @type ItemDefinitionModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'bg item-def');
		this.buttons = Pixies.createElement(this.container,'div', 'buttons');
		this.close = Pixies.createElement(this.buttons, 'button', null, 'Close', () => this.game.editor.activeItemImageDefinition.set(null));

		this.slot = Pixies.createElement(this.container, 'div', 'slot');
		this.inner = Pixies.createElement(this.slot, 'div', 'inner');

		this.gui = GUIHelper.createGUI();
		const position = GUIHelper.addVector3(this.gui, this.model.cameraPosition, 'camera position', -30, 30, 0.1);
		position.open();
		const size = GUIHelper.addScaler(this.gui, this.model.cameraSize, 'value', 10, 40, 1);

		const pos = GUIHelper.addVector3(this.gui, this.model.itemPosition, 'item position', -30, 30, 0.1);
		pos.open();

		const quaternion = GUIHelper.addRotationVector3(this.gui, this.model.itemRotation, 'item rotation');
		quaternion.open();

		this.updateImage();
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.gui.destroy();
		this.gui = null;
	}

	renderInternal() {
		this.updateImage();
	}

	updateImage() {
		const itemDef = this.model;

		this.game.assets.loadItemModel3d(itemDef.id.get(), (mesh) => {
			ItemInventoryImageHelper.renderImage(
				window.document.body,
				itemDef, mesh,
				(img) => {
					Pixies.emptyElement(this.inner);
					this.inner.appendChild(img.cloneNode(true));
				},
				(msg) => console.log('item model loading failed', itemDef.id.get(), msg));
		});

	}

}
