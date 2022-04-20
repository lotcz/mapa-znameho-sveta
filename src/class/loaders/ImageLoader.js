import AssetLoader from "./AssetLoader";

/**
 * Loads a single Image
 */
export default class ImageLoader extends AssetLoader {

	loadInternal() {
		const image = new Image();
		image.onload = () => this.finish(image);
		image.onerror = (msg) => this.fail(msg);
		image.src = this.url();
	}

}
