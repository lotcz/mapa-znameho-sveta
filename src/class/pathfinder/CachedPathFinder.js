import Vector2 from "../../model/basic/Vector2";
import CachedTile from "./CachedTile";
import Collection from "../basic/Collection";
import VectorCache from "./VectorCache";

export default class CachedPathFinder {

	/**
	 * @type VectorCache
	 * @desc cached fixed blocks and distances, distances must be reset when start position changes, blocks must be reset during level editing
	 */
	cache;

	/**
	 * @type array
	 * @desc array of vectors representing static blocks - walls and other static objects
	 */
	staticBlocks = [];

	/**
	 * @type array<BattleCharacterModel>
	 * @desc array of NPCs and party characters
	 */
	battleCharacters = [];

	/**
	 * @type VectorCache
	 */
	dynamicBlocksCache;

	/**
	 * @type boolean
	 */
	dynamicBlocksCacheNeedsRebuild;

	/**
	 * @type Vector2
	 * @desc start position, when it changes, all distances must be reset
	 */
	start;

	constructor() {
		this.cache = new VectorCache();
		this.dynamicBlocksCache = new VectorCache();
		this.resetDynamicBlocksCache();
		this.start = new Vector2();
		this.start.addOnChangeListener(() => {
			this.resetCachedDistances();
			this.cache.set(this.start, new CachedTile(false, 0));
		});
	}

	setStaticBlocks(blocks) {
		this.staticBlocks = blocks;
		this.cache.reset();
	}

	setBattleCharacters(bcs) {
		this.battleCharacters = bcs;
		this.resetDynamicBlocksCache();
	}

	resetDynamicBlocksCache() {
		this.dynamicBlocksCacheNeedsRebuild = true;
	}

	rebuildDynamicBlocksCache() {
		this.dynamicBlocksCache.reset();
		this.battleCharacters.forEach((bc) => {
			const pos = bc.position.round();
			this.dynamicBlocksCache.set(pos, bc);
			if (bc.nextPosition.isSet()) {
				const nex = bc.nextPosition.get();
				if (!pos.equalsTo(nex)) {
					this.dynamicBlocksCache.set(nex, bc);
				}
			}
		});
		this.dynamicBlocksCacheNeedsRebuild = false;
	}

	resetCachedDistances() {
		this.cache.forEach((x, y, tile) => {
			tile.distance = null;
			tile.cameFrom = null;
		});
	}

	/**
	 *
	 * @param {Vector2} v
	 * @returns {CachedTile}
	 */
	obtainCachedTile(v) {
		let tile = this.cache.get(v);
		if (tile === undefined) {
			const blocked = this.staticBlocks.some((b) => v.equalsTo(b));
			tile = new CachedTile(blocked);
			this.cache.set(v, tile);
		}
		return tile;
	}

	isBlockedDynamic(v, ignore = null) {
		if (this.dynamicBlocksCacheNeedsRebuild) {
			this.rebuildDynamicBlocksCache();
		}
		const bc = this.dynamicBlocksCache.get(v);
		return (bc !== undefined && bc !== ignore);
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

	isDiameterBlocked(start, end, ignore = null) {
		const one = start.add(new Vector2(end.x - start.x, 0));
		if (this.isBlocked(one, ignore)) {
			return true;
		}
		const two = start.add(new Vector2(0, end.y - start.y));
		return this.isBlocked(two, ignore);
	}

	backtrack(path, v) {
		const tile = this.cache.get(v);
		if (tile.distance === 0) {
			return path;
		}
		path.unshift(v);
		return this.backtrack(path, tile.cameFrom);
	}

	findPath(start, end, maxDistance = 100, ignore = null) {
		start = start.round();
		end = end.round();

		if (start.equalsTo(end)) {
			console.log('same');
			return false;
		}

		const endTile = this.obtainCachedTile(end);
		if (endTile.blocked || this.isBlockedDynamic(end, ignore)) return false;

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
				if (neighborTile.blocked) continue;
				if (this.isBlockedDynamic(neighborPosition, ignore)) continue;

				const dist = currentPosition.distanceTo(neighborPosition);
				if (dist > 1) {
					if (this.isDiameterBlocked(currentPosition, neighborPosition, ignore)) continue;
				}

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
