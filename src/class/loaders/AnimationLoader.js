import GenericLoader from "./GenericLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import AnimationHelper from "../AnimationHelper";

/**
 * Loads a glb file and returns AnimationHelper
 */
export default class AnimationLoader extends GenericLoader {

	loadInternal() {
		const loader = new GLTFLoader();
		loader.load(
			this.url,
			(gltf) => this.finish(new AnimationHelper(gltf)),
			null,
			(err) => this.fail(`Animation '${this.url}' not loaded: ${err}`)
		);
	}

}
