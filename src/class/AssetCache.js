import Dictionary from "./Dictionary";
import DirtyValue from "../node/DirtyValue";
import Collection from "./Collection";
import AnimationLoader from "./loaders/AnimationLoader";
import ImageLoader from "./loaders/ImageLoader";

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
			const url = 'res/' + uri;

			const existingLoader = this.loaders.find((l) => l.url === url);
			if (existingLoader) {
				existingLoader.addLoaderEventsListeners(onLoaded,null);
				return;
			}

			const loaderType = this.detectLoaderTypeFromUri(uri);
			const loader = new loaderType(url);
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

	detectLoaderTypeFromUri(uri) {
		if (uri.startsWith('img/')) return ImageLoader;
		if (uri.startsWith('glb/')) return 0;
		if (uri.startsWith('animation/')) return AnimationLoader;
		console.warn(`Resource type could not be inferred from URI ${uri}`);
	}

}
