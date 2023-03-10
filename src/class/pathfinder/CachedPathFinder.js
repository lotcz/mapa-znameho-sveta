import Vector2 from "../../model/basic/Vector2";
import TileCache from "./TileCache";
import Collection from "../basic/Collection";

export default class CachedPathFinder {

	/**
	 * @type object
	 * @desc cached fixed blocks and distances, distances must be reset when start position changes, blocks must be reset during level editing
	 */
	cache;

	/**
	 * @type array
	 * @desc array of vectors representing static blocks - walls and other static objects
	 */
	staticBlocks = [];

	/**
	 * @type array
	 * @desc array of vectors representing dynamic blocks - NPCs and other moving objects
	 */
	dynamicBlocks = [];

	/**
	 * @type object
	 */
	dynamicBlocksCache;

	/**
	 * @type Vector2
	 * @desc start position, when it changes, all distances must be reset
	 */
	start;

	constructor() {
		this.start = new Vector2();
		this.start.addOnChangeListener(() => {
			this.resetCachedDistances();
			this.setCachedTile(this.start, new TileCache(false, 0));
		});
		this.resetCache();
		this.resetDynamicBlocksCache();
	}

	setStaticBlocks(blocks) {
		this.staticBlocks = blocks;
		this.resetCache();
	}

	setDynamicBlocks(blocks) {
		this.dynamicBlocks = blocks;
		this.resetDynamicBlocksCache();
	}

	resetCache() {
		this.cache = {};
	}

	resetDynamicBlocksCache() {
		this.dynamicBlocksCache = null;
	}

	rebuildDynamicBlocksCache() {
		this.dynamicBlocksCache = {};
		this.dynamicBlocks.forEach((b) => {
			const v = b.round();
			let row = this.dynamicBlocksCache[v.x];
			if (row === undefined) {
				row = {};
				this.dynamicBlocksCache[v.x] = row;
			}
			row[v.y] = b;
		});
	}

	forEachCache(func) {
		for (let x in this.cache) {
			const yRow = this.cache[x];
			for (let y in yRow) {
				const tile = yRow[y];
				func(x, y, tile);
			}
		}
	}

	resetCachedDistances() {
		this.forEachCache((x, y, tile) => {
			tile.distance = null;
			tile.cameFrom = null;
		});
	}

	/**
	 *
	 * @param v {Vector2}
	 * @returns {undefined|TileCache}
	 */
	getCachedTile(v) {
		const yRow = this.cache[v.x];
		if (yRow === undefined) {
			return undefined;
		}
		return yRow[v.y];
	}

	setCachedTile(v, tile) {
		let yRow = this.cache[v.x];
		if (yRow === undefined) {
			yRow = {};
			this.cache[v.x] = yRow;
		}
		yRow[v.y] = tile;
	}

	/**
	 *
	 * @param v {Vector2}
	 * @returns {TileCache}
	 */
	obtainCachedTile(v) {
		let tile = this.getCachedTile(v);
		if (tile === undefined) {
			const blocked = this.staticBlocks.some((b) => v.equalsTo(b));
			tile = new TileCache(blocked);
			this.setCachedTile(v, tile);
		}
		return tile;
	}

	isBlockedDynamic(v, ignore = null) {
		if (!this.dynamicBlocksCache) {
			this.rebuildDynamicBlocksCache();
		}
		const row = this.dynamicBlocksCache[v.x];
		if (row === undefined) return false;
		const b = row[v.y];
		return (b !== undefined && b !== ignore);
	}

	isBlockedStatic(v) {
		return this.obtainCachedTile(v).blocked;
	}

	isBlocked(v, ignore = null) {
		if (this.isBlockedDynamic(v, ignore)) {
			return true;
		}
		return this.isBlockedStatic(v);
	}

	isDiameterBlocked(start, end) {
		const one = start.add(new Vector2(end.x - start.x, 0));
		if (this.isBlocked(one)) {
			return true;
		}
		const two = start.add(new Vector2(0, end.y - start.y));
		return this.isBlocked(two);
	}

	backtrack(path, v) {
		const tile = this.getCachedTile(v);
		if (tile.distance === 0) {
			return path;
		}
		path.unshift(v);
		return this.backtrack(path, tile.cameFrom);
	}

	findPath(start, end, maxDistance = 100) {
		start = start.round();
		end = end.round();

		const endTile = this.obtainCachedTile(end);
		if (endTile.blocked || this.isBlockedDynamic(end)) return false;

		this.start.set(start);
		let currentPosition = null;
		let currentTile = null;
		const positionsForProcessing = new Collection();
		positionsForProcessing.add(start);

		while (endTile.cameFrom === null && positionsForProcessing.count() > 0) {
			currentPosition = positionsForProcessing.removeFirst();
			currentTile = this.obtainCachedTile(currentPosition);
			const neighbors = currentPosition.getNeighborPositions();
			for (let i = 0, max = neighbors.length; i < max; i++) {
				const neighborPosition = neighbors[i];
				const neighborTile = this.obtainCachedTile(neighborPosition);
				if (neighborTile.blocked || this.isBlockedDynamic(neighborPosition)) continue;

				const dist = currentPosition.distanceTo(neighborPosition);
				if (dist > 1 && this.isDiameterBlocked(currentPosition, neighborPosition)) continue;

				const nDist = currentTile.distance + dist;
				if (nDist > maxDistance) continue;

				if (neighborTile.distance === null || neighborTile.distance > nDist) {
					neighborTile.distance = nDist;
					neighborTile.cameFrom = currentPosition;
					if (neighborTile === endTile) break;
					positionsForProcessing.add(neighborPosition);
				}
			}
		}

		if (endTile.cameFrom === null) return false;
		return this.backtrack([end], endTile.cameFrom);
	}

	getFreeNeighborPositions(position, size = 1, ignore = null) {
		const candidates = position.getNeighborPositions(size);
		return candidates.filter((c) => !this.isBlocked(c, ignore));
	}

}
