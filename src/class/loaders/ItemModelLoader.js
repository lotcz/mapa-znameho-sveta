import AssetLoader from "./AssetLoader";
import Pixies from "../basic/Pixies";
import {Object3D} from "three";

/**
 * Loads a 3d model for item
 */
export default class ItemModelLoader extends AssetLoader {

	loadInternal() {

		const id = Pixies.extractId(this.uri);
		const itemDef = this.assets.resources.itemDefinitions.getById(id);

		this.assets.getAsset(`m3d/${itemDef.modelId.get()}`, (mesh) => {
			const item = mesh.clone();
			const wrapper = new Object3D();
			wrapper.add(item);
			wrapper.scale.set(itemDef.scale.x, itemDef.scale.y, itemDef.scale.z);
			this.finish(wrapper);
		});
	}

}
