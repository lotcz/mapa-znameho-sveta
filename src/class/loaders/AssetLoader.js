import Node from "../Node";

/**
 * Loads a single raw resource.
 */
export default class AssetLoader extends Node {

	uri;

	assets;

	constructor(assets, uri) {
		super();
		this.assets = assets;
		this.uri = uri;
	}

	load(onLoaded, onError = null) {
		this.addLoaderEventsListeners(onLoaded, onError);
		this.loadInternal();
	}

	/**
	 * Override this and call finish()
	 */
	loadInternal() {
		// do something
		// then call this.finish(result) or fail(msg)
	}

	finish(result) {
		this.triggerEvent('load', result);
	}

	fail(msg) {
		this.triggerEvent('error', msg);
	}

	addLoaderEventsListeners(onLoaded = null, onError = null) {
		if (onLoaded) this.addEventListener('load', onLoaded);
		if (onError) this.addEventListener('error', onError);
	}

	url() {
		return 'assets/' + this.uri;
	}

}
