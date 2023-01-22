import AssetLoader from "./AssetLoader";

/**
 * Loads a single audio file (Audio object)
 */
export default class AudioLoader extends AssetLoader {

	loadInternal() {
		const audio = new Audio();
		audio.addEventListener('canplaythrough', () => this.finish(audio));
		audio.onerror = (msg) => this.fail(msg);
		audio.src = this.url();
	}

}
