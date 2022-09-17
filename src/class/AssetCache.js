import Dictionary from "./basic/Dictionary";
import DirtyValue from "../model/basic/DirtyValue";
import Collection from "./basic/Collection";
import ImageLoader from "./loaders/ImageLoader";
import GlbLoader from "./loaders/GlbLoader";
import MaterialLoader from "./loaders/MaterialLoader";
import Pixies from "./basic/Pixies";
import ItemImageLoader from "./loaders/ItemImageLoader";
import Model3dLoader from "./loaders/Model3dLoader";
import ItemModel3dLoader from "./loaders/ItemModel3dLoader";
import SpriteLoader from "./loaders/SpriteLoader";

const ASSET_TYPE_LOADERS = {
	'img': ImageLoader,
	'glb': GlbLoader,
	'mat': MaterialLoader,
	'm3d': Model3dLoader,
	'it3': ItemModel3dLoader,
	'itm': ItemImageLoader,
	'spr': SpriteLoader
}

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

	constructor(resources) {
		this.resources = resources;
		this.cache = new Dictionary();
		this.loaders = new Collection();
		this.loaders.addOnAddListener(() => this.updateLoadingState());
		this.loaders.addOnRemoveListener(() => this.updateLoadingState());
		this.isLoading = new DirtyValue(false);

	}

	updateLoadingState() {
		this.isLoading.set(!this.loaders.isEmpty());
	}

	resetCache(name = null) {
		if (name) {
			this.cache.remove(name);
		} else {
			this.cache.reset();
		}
	}

	getAsset(uri, onLoaded = null, onError = null) {
		const onFailHandler = (msg) => {
			console.error(`Loading of asset '${uri}' failed: ${msg}`);
			if (onError) {
				onError(msg);
			}
		}

		if (this.cache.exists(uri)) {
			onLoaded(this.cache.get(uri));
		} else {
			const existingLoader = this.loaders.find((l) => l.uri === uri);
			if (existingLoader) {
				existingLoader.addLoaderEventsListeners(onLoaded, onFailHandler);
				return;
			}

			const assetType = Pixies.extractId(uri, 0);
			if (ASSET_TYPE_LOADERS[assetType] === undefined) {
				console.error(`Valid resource type could not be inferred from URI ${uri}`);
			}

			const loaderType = ASSET_TYPE_LOADERS[assetType];
			const loader = new loaderType(this, uri);
			this.loaders.add(loader);
			loader.load(
				(resource) => {
					if (this.cache.exists(uri)) {
						this.cache.set(uri, resource);
						console.warn(`Resource ${uri} was already present when loaded and replaced.`);
					} else {
						this.cache.add(uri, resource);
					}
					this.loaders.remove(loader);
					if (onLoaded) onLoaded(resource);
				},
				onFailHandler
			);
		}
	}

	loadMaterial(materialId, onLoaded) {
		this.getAsset(`mat/${materialId}`, onLoaded);
	}

	resetMaterial(materialId) {
		this.resetCache(`mat/${materialId}`);
	}

	loadModel3d(modelId, onLoaded) {
		this.getAsset(`m3d/${modelId}`, onLoaded);
	}

	loadItemModel3d(itemDefId, onLoaded) {
		this.getAsset(`it3/${itemDefId}`, onLoaded);
	}

	loadItemImage(itemDefId, onLoaded) {
		this.getAsset(`itm/${itemDefId}`, onLoaded);
	}

	loadSprite(spriteId, onLoaded) {
		this.getAsset(`spr/${spriteId}`, onLoaded);
	}
}
