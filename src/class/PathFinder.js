import Pixies from "./basic/Pixies";
import Vector2 from "../model/basic/Vector2";

const DEBUG_PATH_FINDER = true;

export default class PathFinder {

	/**
	 * @param {Vector2} start
	 * @param {Vector2} end
	 * @param {array<Vector2>} blocks
	 * @param {array<Vector2> | null} free
	 * @returns {array<Vector2>| false}
	 */
	static findPath(start, end, blocks, free = null) {

		if (DEBUG_PATH_FINDER) console.log(`Going from [${start.x}, ${start.y}] to [${end.x}, ${end.y}]`);

		const relevantBlocks = PathFinder.filterArea(start, end, blocks);
		const isBlocked = relevantBlocks.length > 0;

		if (!isBlocked) {
			return [end];
		}

		const minX = Math.min(start.x, end.x);
		const minY = Math.min(start.y, end.y);
		const maxX = Math.max(start.x, end.x);
		const maxY = Math.max(start.y, end.y);
		const width = maxX - minX + 1;
		const height = maxY - minY + 1;

		if (width <= 1 || height <= 1) {
			if (DEBUG_PATH_FINDER) console.log(`width: ${width}, height: ${height}`);
			if (DEBUG_PATH_FINDER) console.log(`Too thin and blocked.`);
			return false;
		}

		let relevantFree;

		if (!free) {
			relevantFree = [];
			for (let x = minX; x <= maxX; x++) {
				for (let y = minY; y <= maxY; y++) {
					if (!PathFinder.isTileBlocked(x, y, relevantBlocks)) {
						relevantFree.push(new Vector2(x, y));
					}
				}
			}
		} else {
			relevantFree = PathFinder.filterArea(start, end, free);
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
			return false;
		}

		if (DEBUG_PATH_FINDER) console.log(`Next point is [${point.x}, ${point.y}]`);

		let nextPath;

		if (fromStart) {
			nextPath = PathFinder.findPath(point, end, relevantBlocks, relevantFree);
			if (nextPath) {
				return [point, ...nextPath];
			}
		} else {
			nextPath = PathFinder.findPath(start, point, relevantBlocks, relevantFree);
			if (nextPath) {
				return [...nextPath, end];
			}
		}

		if (DEBUG_PATH_FINDER) console.log(`Out of options`);

		return false;
	}

	static isInArea(v, start, end) {
		return Pixies.isBetween(v.x, start.x, end.x) && Pixies.isBetween(v.y, start.y, end.y);
	}

	static filterArea(start, end, vectors) {
		return vectors.filter((v) => PathFinder.isInArea(v, start, end));
	}

	static isAreaBlocked(start, end, blocks) {
		return blocks.some((b) => PathFinder.isInArea(b, start, end));
	}

	static isTileBlocked(x, y, blocks) {
		return blocks.some((b) => {
			const rounded = b.round();
			return rounded.x === x && rounded.y === y;
		});
	}

}
