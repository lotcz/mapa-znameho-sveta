import Pixies from "./basic/Pixies";
import Vector2 from "../model/basic/Vector2";

const DEBUG_PATH_FINDER = false;
const SHOW_PATH_FINDER_STATS = false;

export default class PathFinder {

	/**
	 * @param {Vector2} start
	 * @param {Vector2} end
	 * @param {array<Vector2>} blocks
	 */
	static findBestPath(start, end, blocks) {
		const maxAttempts = 20;
		const maxSuccess = 3;
		const results = [];

		let attempts = 0;

		while (attempts < maxAttempts && results.length < maxSuccess) {
			const path = PathFinder.findPath(start, end, blocks);
			if (path) {
				if (path.length === 1) {
					if (SHOW_PATH_FINDER_STATS) {
						console.log(`Way clear! (${attempts} attempts)`);
					}
					return path;
				}
				results.push(path);
			}
			attempts++;
		}

		if (results.length === 0) {
			if (DEBUG_PATH_FINDER) console.log(`No results found :-(`);
			if (SHOW_PATH_FINDER_STATS) {
				console.log(`Total ${attempts} attempts, but none successful`);
			}
			return false;
		}

		let best = results[0];
		let worst = results[0];
		let bestLength = PathFinder.pathLength(start, results[0]);
		let worstLength = bestLength;

		if (results.length > 1) {
			for (let i = 1; i < results.length; i++) {
				const length = PathFinder.pathLength(start, results[i]);
				if (length < bestLength) {
					best = results[i];
					bestLength = length;
				}
				if (length > worstLength) {
					worst = results[i];
					worstLength = length;
				}
			}
		}

		if (SHOW_PATH_FINDER_STATS) {
			console.log(`Total ${attempts} attempts, ${results.length} successful`);
			console.log(`Best path ${best.length} nodes, ${bestLength} length`);
			console.log(`Worst path ${worst.length} nodes, ${worstLength} length`);
		}

		return best;
	}

	/**
	 * @param {Vector2} start
	 * @param {Vector2} end
	 * @param {array<Vector2>} blocks
	 * @param {array<Vector2> | null} free
	 * @param {boolean} expanded
	 * @returns {array<Vector2>| false}
	 */
	static findPath(start, end, blocks, free = null, expanded = false) {

		if (DEBUG_PATH_FINDER) console.log(`Going from [${start.x}, ${start.y}] to [${end.x}, ${end.y}]`);

		const isBlocked = PathFinder.isAreaBlocked(start, end, blocks);
		if (!isBlocked) {
			return [end];
		}

		const minX = Math.min(start.x, end.x);
		const minY = Math.min(start.y, end.y);
		const maxX = Math.max(start.x, end.x);
		const maxY = Math.max(start.y, end.y);
		const width = maxX - minX + 1;
		const height = maxY - minY + 1;

		if (DEBUG_PATH_FINDER) console.log(`width: ${width}, height: ${height}`);

		const offset = new Vector2();

		if (width <= 1 || height <= 1) {
			if (expanded) {
				if (DEBUG_PATH_FINDER) console.log(`Too thin and blocked. No more expansion.`);
				return false;
			}
			if (DEBUG_PATH_FINDER) console.log(`Too thin and blocked. Expanding range`);
			const offsetX = (width <= 1) ? 2 : 0;
			const offsetY = (height <= 1) ? 2 : 0;
			offset.set(offsetX, offsetY);
			expanded = true;
		}

		const relevantBlocks = PathFinder.filterArea(start.subtract(offset), end.add(offset), blocks);

		let relevantFree;

		if (!free) {
			relevantFree = [];
			for (let x = minX - offset.x, max = maxX + offset.x; x <= max; x++) {
				for (let y = minY - offset.y, max = maxY + offset.y; y <= max; y++) {
					const tile = new Vector2(x, y);
					if (!PathFinder.isTileBlocked(tile, relevantBlocks)) {
						relevantFree.push(tile);
					}
				}
			}
		} else {
			relevantFree = PathFinder.filterArea(start.subtract(offset), end.add(offset), free);
		}

		if (relevantFree.length === 0) {
			if (DEBUG_PATH_FINDER) console.log(`No free tiles to go`);
			return false;
		}

		const check = [...relevantFree];

		let point = null;
		let fromStart = true;

		while (check.length > 0 && (point === null)) {
			const i = Pixies.randomIndex(check.length);
			const candidate = check[i];
			check.splice(i, 1);
			if (!(candidate.equalsTo(start) || candidate.equalsTo(end))) {
				if (!PathFinder.isAreaBlocked(start, candidate, relevantBlocks)) {
					point = candidate;
				} else if (!PathFinder.isAreaBlocked(candidate, end, relevantBlocks)) {
					point = candidate;
					fromStart = false;
				}
			}
		}

		if (point === null) {
			if (DEBUG_PATH_FINDER) console.log(`No valid point found`);
			return false;
		}

		if (DEBUG_PATH_FINDER) console.log(`Next point is [${point.x}, ${point.y}]`);

		let nextPath;

		if (fromStart) {
			nextPath = PathFinder.findPath(point, end, relevantBlocks, relevantFree, expanded);
			if (nextPath) {
				return [point, ...nextPath];
			}
		} else {
			nextPath = PathFinder.findPath(start, point, relevantBlocks, relevantFree, expanded);
			if (nextPath) {
				return [...nextPath, end];
			}
		}

		if (DEBUG_PATH_FINDER) console.log(`Out of options`);

		return false;
	}

	static filterArea(start, end, vectors) {
		return vectors.filter((v) => PathFinder.isInArea(v, start, end));
	}

	static isAreaBlocked(start, end, blocks) {
		return blocks.some((b) => PathFinder.isInArea(b, start, end));
	}

	static isInArea(v, start, end) {
		return Pixies.isBetween(v.x, start.x, end.x) && Pixies.isBetween(v.y, start.y, end.y);
	}

	static isTileBlocked(v, blocks) {
		const t = v.round();
		return blocks.some((b) => t.equalsTo(b));
	}

	static pathLength(start, path) {
		if (path.length <= 0) return 0;

		let sum = start.distanceTo(path[0]);

		if (path.length > 1) {
			for (let i = 1; i < path.length; i++) {
				sum += path[i - 1].distanceTo(path[i]);
			}
		}

		return sum;
	}

	static getNeighborPositions(position, size = 1) {
		const neighbors = [];
		for (let x = position.x - size; x <= position.x + size; x++) {
			for (let y = position.y - size; y <= position.y + size; y++) {
				const n = new Vector2(x, y);
				if (!position.equalsTo(n)) {
					neighbors.push(n);
				}
			}
		}
		return neighbors;
	}

	static getFreeNeighborPositions(position, blocks, size = 1) {
		const candidates = PathFinder.getNeighborPositions(position, size);
		return candidates.filter((c) => !PathFinder.isTileBlocked(c, blocks));
	}

	static findClosest(start, destinations) {
		if ((!destinations) || destinations.length === 0) return null;
		if (destinations.length === 1) return destinations[0];
		let closest = destinations[0];
		let distance = start.distanceTo(closest);
		for (let i = 1, max = destinations.length; i < max; i++) {
			const d = start.distanceTo(destinations[i]);
			if (d < distance) {
				closest = destinations[i];
				distance = d;
			}
		}
		return closest;
	}
}
