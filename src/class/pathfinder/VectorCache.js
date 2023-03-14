export default class VectorCache {

	/**
	 * @type object
	 */
	cache;

	constructor() {
		this.reset();
	}

	reset() {
		this.cache = {};
	}

	forEach(func) {
		for (let x in this.cache) {
			const yRow = this.cache[x];
			for (let y in yRow) {
				const tile = yRow[y];
				func(x, y, tile);
			}
		}
	}

	/**
	 *
	 * @param {Vector2} v
	 * @returns {undefined|any}
	 */
	get(v) {
		const yRow = this.cache[v.x];
		if (yRow === undefined) {
			return undefined;
		}
		return yRow[v.y];
	}

	/**
	 *
	 * @param {Vector2} v
	 * @param {any} tile
	 */
	set(v, tile) {
		let yRow = this.cache[v.x];
		if (yRow === undefined) {
			yRow = {};
			this.cache[v.x] = yRow;
		}
		yRow[v.y] = tile;
	}

}
