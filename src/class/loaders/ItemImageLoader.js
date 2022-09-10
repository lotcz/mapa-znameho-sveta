import AssetLoader from "./AssetLoader";
import ItemDefinitionRenderer from "../../renderer/basic/ItemDefinitionRenderer";
import Pixies from "../basic/Pixies";

/**
 * Loads a single Image for item
 */
export default class ItemImageLoader extends AssetLoader {

	loadInternal() {

		const id = Pixies.extractId(this.uri);
		const itemDef = this.assets.resources.itemDefinitions.getById(id);
		const model = this.assets.resources.models3d.getById(itemDef.modelId.get());

		this.assets.getAsset(model.uri.get(), (gltf) => {
			ItemDefinitionRenderer.renderImage(window.document.body, itemDef, gltf, (img) => this.finish(img), (msg) => this.fail(msg));
		});

	}

}
