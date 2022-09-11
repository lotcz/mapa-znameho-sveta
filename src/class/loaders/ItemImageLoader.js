import AssetLoader from "./AssetLoader";
import Pixies from "../basic/Pixies";
import ItemInventoryImageHelper from "../../renderer/items/InventoryImageHelper";

/**
 * Loads a single Image for inventory item
 */
export default class ItemImageLoader extends AssetLoader {

	loadInternal() {

		const id = Pixies.extractId(this.uri);

		this.assets.getAsset(`it3/${id}`, (mesh) => {
			const itemDef = this.assets.resources.itemDefinitions.getById(id);
			ItemInventoryImageHelper.renderImage(window.document.body, itemDef, mesh, (img) => this.finish(img), (msg) => this.fail(msg));
		});

	}

}
