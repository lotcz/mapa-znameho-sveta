import * as THREE from "three";
import AssetLoader from "./AssetLoader";
import Pixies from "../basic/Pixies";

/**
 * Loads a single Sprite
 */
export default class SpriteLoader extends AssetLoader {

	loadInternal() {

		const spriteId = Pixies.extractId(this.uri);
		const sprite = this.assets.resources.sprites.getById(spriteId);

		if (!sprite) {
			this.fail(`Sprite ${spriteId} not found!`);
			return;
		}

		this.assets.getAsset(sprite.uri.get(), (img) => {
			const texture = new THREE.Texture();
			texture.image = img;
			texture.needsUpdate = true;
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set(1, 1);
			const mesh = new THREE.Mesh(new THREE.PlaneGeometry(sprite.size.x, sprite.size.y), new THREE.MeshBasicMaterial({transparent: true, map:texture}));
			mesh.position.set(sprite.coordinates.x, sprite.coordinates.y, sprite.coordinates.z);
			const target = mesh.position.clone().add(new THREE.Vector3(-1,1, -1));
			mesh.lookAt(target.x, target.y, target.z);
			this.finish(mesh);
		});

	}

}
