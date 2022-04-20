import AssetLoader from "./AssetLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

/**
 * Loads a glb file and returns AnimationHelper
 */
export default class GlbLoader extends AssetLoader {

	loadInternal() {
		const loader = new GLTFLoader();
		loader.load(
			this.url(),
			(gltf) => this.finish(gltf.scene),
			null,
			(err) => this.fail(`Glb '${this.url()}' not loaded: ${err}`)
		);
	}

}
