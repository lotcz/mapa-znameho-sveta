import AssetLoader from "./AssetLoader";
import Pixies from "../basic/Pixies";
import * as THREE from "three";

/**
 * Loads a single 3D Sprite
 */
export default class Sprite3dLoader extends AssetLoader {

	loadInternal() {

		const sprite3dId = Pixies.extractId(this.uri);
		const sprite3d = this.assets.resources.sprites3d.getById(sprite3dId);

		if (!sprite3d) {
			this.fail(`Sprite ${sprite3dId} not found!`);
			return;
		}

		this.assets.loadModel3d(sprite3d.modelId.get(), (model) => {
			const mesh = model.clone();
			const group = new THREE.Group();
			group.add(mesh);
			mesh.position.set(sprite3d.coordinates.x, sprite3d.coordinates.y, sprite3d.coordinates.z);
			group.scale.set(sprite3d.scale.x, sprite3d.scale.y, sprite3d.scale.z);
			this.finish(mesh);
		});

	}

}
