import AssetLoader from "./AssetLoader";
import Pixies from "../basic/Pixies";
import {Object3D} from "three";

/**
 * Loads a 3d model for item
 */
export default class ItemModelLoader extends AssetLoader {

	primaryLoaded = true;
	secondaryLoaded = true;

	loadInternal() {

		const id = Pixies.extractId(this.uri);
		const itemDef = this.assets.resources.itemDefinitions.getById(id);

		this.assets.getAsset(`m3d/${itemDef.modelId.get()}`, (mesh) => {
			const itemMesh = mesh.clone();
			const wrapper = new Object3D();
			wrapper.add(itemMesh);
			wrapper.scale.set(itemDef.scale.x, itemDef.scale.y, itemDef.scale.z);

			if (itemDef.primaryMaterialId.isSet()) {
				this.primaryLoaded = false;
				this.assets.getAsset(
					`mat/${itemDef.primaryMaterialId.get()}`,
					(material) => {
						itemMesh.traverse((msh) => {
							if (msh.material && msh.geometry && msh.material.name === 'PrimaryMaterial') {
								msh.material.dispose();
								msh.material = material;
								msh.castShadow = true;
								msh.receiveShadow = false;
							}
						});
						this.primaryLoaded = true;
						this.checkFinished(wrapper);
					}
				);
			}

			if (itemDef.secondaryMaterialId.isSet()) {
				this.secondaryLoaded = false;
				this.assets.getAsset(
					`mat/${itemDef.secondaryMaterialId.get()}`,
					(material) => {
						itemMesh.traverse((msh) => {
							if (msh.material && msh.geometry && msh.material.name === 'SecondaryMaterial') {
								msh.material.dispose();
								msh.material = material;
								msh.castShadow = true;
								msh.receiveShadow = false;
							}
						});
						this.secondaryLoaded = true;
						this.checkFinished(wrapper);
					}
				);
			}

			this.checkFinished(wrapper);
		});
	}

	checkFinished(wrapper) {
		if (this.primaryLoaded && this.secondaryLoaded) {
			this.finish(wrapper);
		}
	}
}
