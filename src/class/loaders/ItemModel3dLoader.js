import AssetLoader from "./AssetLoader";
import Pixies from "../basic/Pixies";
import {Object3D} from "three";

/**
 * Loads a 3d model for item
 */
export default class ItemModel3dLoader extends AssetLoader {

	loadInternal() {

		this.primaryLoaded = true;
		this.secondaryLoaded = true;
		this.isFinished = false;

		const itemDefId = Pixies.extractId(this.uri);
		const itemDef = this.assets.resources.itemDefinitions.getById(itemDefId);

		if (itemDef.primaryMaterialId.isSet()) {
			this.primaryLoaded = false;
		}

		if (itemDef.secondaryMaterialId.isSet()) {
			this.secondaryLoaded = false;
		}

		this.assets.loadModel3d(itemDef.modelId.get(), (mesh) => {
			const itemMesh = mesh.clone();
			this.wrapper = new Object3D();
			this.wrapper.add(itemMesh);
			this.wrapper.scale.set(itemDef.scale.x, itemDef.scale.y, itemDef.scale.z);

			if (itemDef.primaryMaterialId.isSet()) {
				this.assets.loadMaterial(
					itemDef.primaryMaterialId.get(),
					(material) => {
						itemMesh.traverse((msh) => {
							if (msh.material && msh.geometry && msh.material.name === 'PrimaryMaterial') {
								msh.material.dispose();
								msh.material = material;
								msh.castShadow = true;
								msh.receiveShadow = false;
								msh.userData.originalMaterialName = 'PrimaryMaterial';
							}
						});
						this.primaryLoaded = true;
						this.checkFinished();
					}
				);
			}

			if (itemDef.secondaryMaterialId.isSet()) {
				this.assets.loadMaterial(
					itemDef.secondaryMaterialId.get(),
					(material) => {
						itemMesh.traverse((msh) => {
							if (msh.material && msh.geometry && msh.material.name === 'SecondaryMaterial') {
								msh.material.dispose();
								msh.material = material;
								msh.castShadow = true;
								msh.receiveShadow = false;
								msh.userData.originalMaterialName = 'SecondaryMaterial';
							}
						});
						this.secondaryLoaded = true;
						this.checkFinished();
					}
				);
			}

			this.checkFinished();
		});
	}

	checkFinished() {
		if (this.primaryLoaded && this.secondaryLoaded && !this.isFinished) {
			this.isFinished = true;
			this.finish(this.wrapper);
		}
	}
}
