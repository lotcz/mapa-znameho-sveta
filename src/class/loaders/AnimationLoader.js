import GenericLoader from "./GenericLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

/**
 * Loads a glb file and returns gltf with scene and animations
 */
export default class AnimationLoader extends GenericLoader {

	loadInternal() {
		const loader = new GLTFLoader();
		loader.load(
			this.url,
			(gltf) => this.finish(gltf),
			null,
			(err) => this.fail(`Animation '${this.url}' not loaded: ${err}`)
		);
	}

}
