import Pixies from "../../class/basic/Pixies";
import Vector2 from "../../model/basic/Vector2";
import GUIHelper from "../../class/basic/GUIHelper";
import DomRenderer from "../basic/DomRenderer";
import ItemInventoryImageHelper from "../game/party/InventoryImageHelper";

export const IMAGE_SIZE = new Vector2(80, 80);

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
		this.container = this.addElement('div', 'bg item-def force-foreground');
		this.buttons = Pixies.createElement(this.container,'div', 'buttons');
		this.close = Pixies.createElement(this.buttons, 'button', null, 'Close', () => this.game.editor.activeItemImageDefinition.set(null));

		this.slot = Pixies.createElement(this.container, 'div', 'slot');
		this.inner = Pixies.createElement(this.slot, 'div', 'inner');

		this.gui = GUIHelper.createGUI();
		const position = GUIHelper.addVector3(this.gui, this.model.cameraPosition, 'camera position', -30, 30, 0.1);
		position.open();
		const quaternion = GUIHelper.addQuaternion(this.gui, this.model.cameraQuaternion, 'camera quaternion');
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

		this.game.assets.getAsset(`it3/${itemDef.id.get()}`, (mesh) => {
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
