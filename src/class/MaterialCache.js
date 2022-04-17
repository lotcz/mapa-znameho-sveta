import DirtyValue from "../node/DirtyValue";
import Collection from "./Collection";
import MaterialLoader from "./MaterialLoader";

/**
 * Keeps cached three materials
 */
export default class MaterialCache {

	/**
	 * @type Array
	 */
	cache;

	/**
	 * @type Collection
	 */
	loaders;

	/**
	 * Subscribe to onChange event here to be notified when materials are being loaded.
	 */
	isLoading;

	constructor(resources, assets) {
		this.resources = resources;
		this.assets = assets;
		this.cache = [];
		this.loaders = new Collection();
		this.loaders.addOnAddListener(() => this.updateLoadingState());
		this.loaders.addOnRemoveListener(() => this.updateLoadingState());
		this.isLoading = new DirtyValue(false);
	}

	updateLoadingState() {
		this.isLoading.set(!this.loaders.isEmpty());
	}

	getMaterial(id, onLoaded = null) {
		if (this.cache[i] !== undefined) {
			onLoaded(this.cache[id]);
		} else {
			const loader = new MaterialLoader(id, this.resources, this.assets);
			this.loaders.add(loader);
			loader.load(
				(material) => {
					this.cache[i] = material;
					if (onLoaded) onLoaded(material);
					this.loaders.remove(loader);
				},
				(msg) => {
					console.error(`Error when loading material ${id} - ${msg}`);
					this.loaders.remove(loader);
				}
			);
		}
	}

}
