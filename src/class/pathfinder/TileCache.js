export default class TileCache {

	/**
	 * @type boolean
	 */
	blocked;

	/**
	 * @type float|null
	 */
	distance;

	/**
	 * @type Vector2|null
	 */
	cameFrom;

	constructor(blocked, distance = null) {
		this.blocked = blocked;
		this.distance = distance;
		this.cameFrom = null;
	}

}
