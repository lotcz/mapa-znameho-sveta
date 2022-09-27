import AssetLoader from "./AssetLoader";
import Pixies from "../basic/Pixies";
import * as THREE from "three";

/**
 * Loads a single 3D Sprite
 */
export default class Sprite3dLoader extends AssetLoader {

	loadInternal() {

		this.primaryLoaded = true;
		this.secondaryLoaded = true;
		this.isFinished = false;

		const sprite3dId = Pixies.extractId(this.uri);
		const sprite3d = this.assets.resources.sprites3d.getById(sprite3dId);

		if (!sprite3d) {
			this.fail(`3D Sprite ${sprite3dId} not found!`);
			return;
		}

		if (sprite3d.primaryMaterialId.isSet()) {
			this.primaryLoaded = false;
		}

		if (sprite3d.secondaryMaterialId.isSet()) {
			this.secondaryLoaded = false;
		}

		this.assets.loadModel3d(sprite3d.modelId.get(), (model) => {
			const mesh = model.clone();
			this.wrapper = new THREE.Group();
			this.wrapper.add(mesh);
			mesh.position.set(sprite3d.coordinates.x, sprite3d.coordinates.y, sprite3d.coordinates.z);
			this.wrapper.scale.set(sprite3d.scale.x, sprite3d.scale.y, sprite3d.scale.z);

			if (sprite3d.primaryMaterialId.isSet()) {
				this.assets.loadMaterial(
					sprite3d.primaryMaterialId.get(),
					(material) => {
						mesh.traverse((msh) => {
							if (msh.material && msh.geometry && msh.material.name === 'PrimaryMaterial') {
								msh.material.dispose();
								msh.material = material;
								msh.castShadow = true;
								msh.receiveShadow = false;
							}
						});
						this.primaryLoaded = true;
						this.checkFinished();
					}
				);
			}

			if (sprite3d.secondaryMaterialId.isSet()) {
				this.assets.loadMaterial(
					sprite3d.secondaryMaterialId.get(),
					(material) => {
						mesh.traverse((msh) => {
							if (msh.material && msh.geometry && msh.material.name === 'SecondaryMaterial') {
								msh.material.dispose();
								msh.material = material;
								msh.castShadow = true;
								msh.receiveShadow = false;
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
