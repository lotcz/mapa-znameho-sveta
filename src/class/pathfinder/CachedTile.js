export default class CachedTile {

	/**
	 * @type boolean
	 */
	blocked;

	/**
	 * @type Number|null
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
