import AssetLoader from "./AssetLoader";
import Pixies from "../basic/Pixies";
import ItemInventoryImageHelper from "../../renderer/game/party/InventoryImageHelper";

/**
 * Loads a single Image for inventory item
 */
export default class ItemImageLoader extends AssetLoader {

	loadInternal() {

		const id = Pixies.extractId(this.uri);

		this.assets.loadItemModel3d(id, (mesh) => {
			const itemDef = this.assets.resources.itemDefinitions.getById(id);
			ItemInventoryImageHelper.renderImage(window.document.body, itemDef, mesh, (img) => this.finish(img), (msg) => this.fail(msg));
		});

	}

}
