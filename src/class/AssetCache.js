import Dictionary from "./basic/Dictionary";
import Collection from "./basic/Collection";
import ImageLoader from "./loaders/ImageLoader";
import GlbLoader from "./loaders/GlbLoader";
import MaterialLoader from "./loaders/MaterialLoader";
import Pixies from "./basic/Pixies";
import ItemImageLoader from "./loaders/ItemImageLoader";
import Model3dLoader from "./loaders/Model3dLoader";
import ItemModel3dLoader from "./loaders/ItemModel3dLoader";
import SpriteLoader from "./loaders/SpriteLoader";
import Sprite3dLoader from "./loaders/Sprite3dLoader";
import AudioLoader from "./loaders/AudioLoader";
import Node from "./basic/Node";

const ASSET_TYPE_LOADERS = {
	'aud': AudioLoader,
	'img': ImageLoader,
	'glb': GlbLoader,
	'mat': MaterialLoader,
	'm3d': Model3dLoader,
	'it3': ItemModel3dLoader,
	'itm': ItemImageLoader,
	'spr': SpriteLoader,
	'sp3': Sprite3dLoader
}

/**
 * Keeps cached raw resources like images, sounds and three models
 */
export default class AssetCache extends Node {

	/**
	 * @type Dictionary
	 */
	cache;

	/**
	 * @type Collection
	 */
	loaders;

	/**
	 * @type int
	 */
	totalLoaders = 0;

	/**
	 * @type int
	 */
	blockingLoaders = 0;

	/**
	 * @type int
	 */
	sessionTotalLoaders = 0;

	/**
	 * @type int
	 */
	sessionFinishedLoaders = 0;

	constructor(resources) {
		super();
		this.resources = resources;
		this.cache = new Dictionary();
		this.loaders = new Collection();
		this.loaders.addOnAddListener((loader) => this.loaderAdded(loader));
		this.loaders.addOnRemoveListener((loader) => this.loaderRemoved(loader));

	}

	loaderAdded(loader) {
		this.updateLoadingState();
		if (!loader.isPreloading) {
			this.sessionTotalLoaders++;
			this.triggerEvent('session-total-loaders-changed', this.sessionTotalLoaders);
		}

	}

	loaderRemoved(loader) {
		this.updateLoadingState();
		if (!loader.isPreloading) {
			this.sessionFinishedLoaders++;
			if (this.blockingLoaders === 0) {
				this.sessionFinishedLoaders = 0;
				this.sessionTotalLoaders = 0;
			}
			this.triggerEvent('session-finished-loaders-changed', this.sessionFinishedLoaders);
		}
	}

	updateLoadingState() {
		const total = this.loaders.count();
		if (this.totalLoaders !== total) {
			this.totalLoaders = total;
			this.triggerEvent('total-loaders-changed', total);
		}
		const blocking = this.loaders.filter((l) => l.isPreloading === false).length;
		if (this.blockingLoaders !== blocking) {
			this.blockingLoaders = blocking;
			this.triggerEvent('blocking-loaders-changed', blocking);
		}
	}

	resetCache(name = null) {
		if (name) {
			this.cache.remove(name);
		} else {
			this.cache.reset();
		}
	}

	loaderFailed(loader, msg, onError) {
		console.error(`Loading of asset '${loader.uri}' failed: ${msg}`);

		if (onError) onError(msg);

		this.loaders.remove(loader);
	}

	loaderSucceeded(loader, resource, onLoaded) {
		if (this.cache.exists(loader.uri)) {
			this.cache.set(loader.uri, resource);
			console.warn(`Resource ${loader.uri} was already present then loaded and replaced.`);
		} else {
			this.cache.add(loader.uri, resource);
		}

		if (onLoaded) onLoaded(resource);

		this.loaders.remove(loader);
	}

	getAsset(uri, onLoaded = null, onError = null) {
		if (typeof uri !== 'string') {
			console.log('uri is not a string', uri);
			return;
		}

		if (this.cache.exists(uri)) {
			if (onLoaded) {
				onLoaded(this.cache.get(uri));
			}
		} else {
			const existingLoader = this.loaders.find((l) => l.uri === uri);
			if (existingLoader) {
				if (onLoaded || onError) {
					existingLoader.addLoaderEventsListeners(onLoaded, onError);
				}
				return;
			}

			const assetType = Pixies.extractId(uri, 0);
			if (ASSET_TYPE_LOADERS[assetType] === undefined) {
				console.error(`Valid resource type could not be inferred from URI ${uri}`);
			}

			const loaderType = ASSET_TYPE_LOADERS[assetType];
			const loader = new loaderType(this, uri, onLoaded === null);
			this.loaders.add(loader);
			loader.load(
				(resource) => this.loaderSucceeded(loader, resource, onLoaded),
				(msg) => this.loaderFailed(loader, msg, onError)
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

	loadSprite3d(sprite3dId, onLoaded) {
		this.getAsset(`sp3/${sprite3dId}`, onLoaded);
	}

	loadItemImage(itemDefId, onLoaded) {
		this.getAsset(`itm/${itemDefId}`, onLoaded);
	}

	loadSprite(spriteId, onLoaded) {
		this.getAsset(`spr/${spriteId}`, onLoaded);
	}

	preload(resources) {
		console.log('Preloading:', resources);
		resources.forEach((r) => this.getAsset(r));
	}

	load(resources) {
		console.log('Loading:', resources);
		resources.forEach((r) => this.getAsset(r, () => undefined));
	}
}
