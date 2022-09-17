import * as THREE from "three";
import AssetLoader from "./AssetLoader";
import Pixies from "../basic/Pixies";

/**
 * Loads a single THREE material.
 */
export default class MaterialLoader extends AssetLoader {

	loadInternal() {

		const id = Pixies.extractId(this.uri);
		const definition = this.assets.resources.materials.getById(id);
		if (!definition) {
			this.fail(`material ID ${this.uri} not found`);
			return;
		}

		const params = {
			color: definition.color.get()
		};

		if (definition.useTexture.get()) {
			this.assets.getAsset(
				definition.uri.get(),
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
					this.finish(this.createMaterial(definition.threeType.get(), params));
				}
			);
		} else {
			this.finish(this.createMaterial(definition.threeType.get(), params));
		}
	}

	createMaterial(threeType, params) {
		return new THREE[threeType](params);
	}

}
