import PathFinder from "./PathFinder";
import Vector2 from "../../model/basic/Vector2";
import TileCache from "./TileCache";

export default class AbsolutePathFinder {

	constructor(start, end, blocks) {
		this.start = start.round();
		this.end = end.round();
		this.blocks = blocks;

		this.cache = {};

		this.currentStep = 0;
		this.maxSteps = 0;
	}

	findPath(steps = 100) {
		this.maxSteps = steps;
		this.currentStep = 0;
		this.setCache(this.start, new TileCache(false, this.currentStep));
		while (this.currentStep <= this.maxSteps) {
			this.processStep();
			this.currentStep += 1;
		}
		const cache = this.getCache(this.end);
		if (cache === null || cache.cameFrom === null) return false;
		return this.backtrack([this.end], cache.cameFrom);
	}

	backtrack(path, tile) {
		const cache = this.getCache(tile);
		if (cache.distance === 0) {
			return path;
		}
		path.unshift(tile);
		return this.backtrack(path, cache.cameFrom);
	}

	processStep() {
		for (let x in this.cache) {
			if (this.currentStep >= this.maxSteps) {
				return;
			}
			const xRow = this.cache[x];
			for (let y in xRow) {
				if (this.currentStep >= this.maxSteps) {
					return;
				}
				const value = xRow[y];
				if (value.blocked !== true && value.distance <= this.currentStep && value.distance > this.currentStep - 1) {
					this.processTile(value.distance, new Vector2(x, y));
				}
			}
		}
	}

	processTile(distance, tile) {
		const neighbors = PathFinder.getNeighborPositions(tile);
		neighbors.forEach((n) => {
			let neighbor = this.getCache(n);
			if (neighbor === null) {
				neighbor = new TileCache(PathFinder.isTileBlocked(n, this.blocks));
				this.setCache(n, neighbor);
			}

			if (neighbor.blocked === true) return;

			const dist = tile.distanceTo(n);
			if (dist > 1 && this.isDiameterBlocked(tile, n)) return;

			const nDist = distance + dist;
			if (nDist > this.maxSteps) return;
			if (neighbor.distance === null || neighbor.distance > nDist) {
				neighbor.distance = nDist;
				neighbor.cameFrom = tile;
				if (n.equalsTo(this.end)) {
					this.maxSteps = nDist;
				}
			}
		});
	}

	getCache(v) {
		if (!(v.x in this.cache)) {
			return null;
		}
		const xRow = this.cache[v.x];
		if (!(v.y in xRow)) {
			return null;
		}
		return xRow[v.y];
	}

	setCache(v, value) {
		if (!(v.x in this.cache)) {
			this.cache[v.x] = {};
		}
		this.cache[v.x][v.y] = value;
	}

	isBlocked(v) {
		let cache = this.getCache(v);
		if (cache === null) {
			cache = new TileCache(PathFinder.isTileBlocked(v, this.blocks));
			this.setCache(v, cache);
		}
		return cache.blocked;
	}

	isDiameterBlocked(start, end) {
		const dX = end.x - start.x;
		const dY = end.y - start.y;
		const one = start.add(new Vector2(dX, 0));
		const two = start.add(new Vector2(0, dY));
		return (this.isBlocked(one) || this.isBlocked(two));
	}

}
