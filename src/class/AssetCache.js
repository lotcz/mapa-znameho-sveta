import Dictionary from "./Dictionary";
import DirtyValue from "../node/DirtyValue";
import AssetLoader from "./AssetLoader";
import Collection from "./Collection";

/**
 * Keeps cached raw resources like images, sounds and three models
 */
export default class AssetCache {

	/**
	 * @type Dictionary
	 */
	cache;

	/**
	 * @type Collection
	 */
	loaders;

	/**
	 * Subscribe to onChange event here to be notified when resources are being loaded.
	 */
	isLoading;

	constructor() {
		this.cache = new Dictionary();
		this.loaders = new Collection();
		this.loaders.addOnAddListener(() => this.updateLoadingState());
		this.loaders.addOnRemoveListener(() => this.updateLoadingState());
		this.isLoading = new DirtyValue(false);
	}

	updateLoadingState() {
		this.isLoading.set(!this.loaders.isEmpty());
	}

	getAsset(uri, onLoaded = null) {
		if (this.cache.exists(uri)) {
			onLoaded(this.cache.get(uri));
		} else {

			const existingLoader = this.loaders.find((l) => l.uri === uri);
			if (existingLoader) {
				existingLoader.addLoaderEventsListeners(onLoaded,null);
				return;
			}

			const loader = new AssetLoader(uri);
			this.loaders.add(loader);
			loader.load(
				(resource) => {
					if (this.cache.exists(uri)) {
						this.cache.set(uri, resource);
						console.warn(`Resource ${uri} was already present when loaded and replaced.`);
					} else {
						this.cache.add(uri, resource);
					}
					if (onLoaded) onLoaded(resource);
					this.loaders.remove(loader);
				},
				(msg) => {
					console.error(`Error when loading resource ${uri} - ${msg}`);
					this.loaders.remove(loader);
				}
			);
		}
	}

}
