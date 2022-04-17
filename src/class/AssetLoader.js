import EventManager from "./EventManager";

export const ASSET_TYPE_IMAGE = 'img';
export const ASSET_TYPE_JSON = 'json';
export const ASSET_TYPE_GLB = 'glb';

/**
 * Loads a single raw resource.
 */
export default class AssetLoader {

	uri;

	eventManager;

	constructor(uri) {
		this.uri = uri;
		this.eventManager = new EventManager();
	}

	detectTypeFromUri(uri) {
		if (uri.startsWith('img/')) return ASSET_TYPE_IMAGE;
		if (uri.startsWith('json/')) return ASSET_TYPE_JSON;
		if (uri.startsWith('glb/')) return ASSET_TYPE_GLB;
		console.warn(`Resource type could not be inferred from URI ${uri}`);
	}

	load(onLoaded, onError = null) {
		this.addLoaderEventsListeners(onLoaded, onError);

		const type = this.detectTypeFromUri(this.uri);

		switch (type) {
			case ASSET_TYPE_IMAGE:
				const image = new Image();
				image.onload = () => {
					this.eventManager.triggerEvent('load', image);
				}
				image.src = 'res/' + this.uri;
				break;
			default:
				this.eventManager.triggerEvent('error', `Resource type '${type}' doesn't exist!`);
		}
	}

	addLoaderEventsListeners(onLoaded = null, onError = null) {
		if (onLoaded) this.eventManager.addEventListener('load', onLoaded);
		if (onError) this.eventManager.addEventListener('error', onError);
	}

}
