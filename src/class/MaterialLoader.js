import * as THREE from "three";

export const MATERIAL_BASIC = 'MeshBasicMaterial';

/**
 * Loads a single THREE material.
 */
export default class MaterialLoader {
	id;

	constructor(materialId, resources, assets) {
		this.id = materialId;
		this.resources = resources;
		this.assets = assets;
	}

	load(onLoaded, onError) {
		const definition = this.resources.materials.getById(this.id);
		if (!definition) {
			onError(`material ID ${this.id} not found`);
			return;
		}

		const params = {
			color: definition.color.get()
		};

		if (definition.texture.isSet()) {
			this.assets.getAsset(
				definition.texture.get().uri,
				(img) => {
					const texture = new THREE.Texture({image: img});
					texture.wrapS = definition.wrapS.get();
					texture.wrapT = definition.wrapT.get();
					texture.repeat.set(
						definition.repeatX.get(),
						definition.repeatY.get()
					);
					params.map = texture;
					onLoaded(this.createMaterial(definition.type.get(), params));
				}
			);
		} else {
			onLoaded(this.createMaterial(definition.type.get(), params));
		}
	}

	createMaterial(type, params) {
		return THREE[type](params);
	}

}
