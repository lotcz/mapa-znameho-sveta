import GenericLoader from "./GenericLoader";

/**
 * Loads a single Image
 */
export default class ImageLoader extends GenericLoader {

	loadInternal() {
		const image = new Image();
		image.onload = () => this.finish(image);
		image.src = this.url;
	}

}
