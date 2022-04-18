import GenericLoader from "./GenericLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

/**
 * Loads a glb file and returns AnimationHelper
 */
export default class GlbLoader extends GenericLoader {

	loadInternal() {
		const loader = new GLTFLoader();
		loader.load(
			this.url,
			(gltf) => this.finish(gltf.scene),
			null,
			(err) => this.fail(`Glb '${this.url}' not loaded: ${err}`)
		);
	}

}
