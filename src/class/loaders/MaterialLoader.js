import * as THREE from "three";
import AssetLoader from "./AssetLoader";
import Pixies from "../Pixies";

/**
 * Loads a single THREE material.
 */
export default class MaterialLoader extends AssetLoader {

	load(onLoaded, onError) {

		const id = Pixies.extractId(this.uri);
		const definition = this.assets.resources.materials.getById(id);
		if (!definition) {
			onError(`material ID ${this.uri} not found`);
			return;
		}

		const params = {
			color: definition.color.get()
		};

		if (definition.texture.isSet()) {
			this.assets.getAsset(
				definition.texture.get().uri,
				(img) => {
					const texture = new THREE.Texture();
					texture.image = img;
					texture.needsUpdate = true;
					texture.wrapS = definition.wrapS.get();
					texture.wrapT = definition.wrapT.get();
					texture.repeat.set(
						definition.repeatX.get(),
						definition.repeatY.get()
					);
					params.map = texture;
					onLoaded(this.createMaterial(definition.threeType.get(), params));
				}
			);
		} else {
			onLoaded(this.createMaterial(definition.type.get(), params));
		}
	}

	createMaterial(threeType, params) {
		return THREE[threeType](params);
	}

}
