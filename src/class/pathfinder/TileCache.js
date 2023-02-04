export default class TileCache {

	constructor(blocked, distance = null) {
		this.blocked = blocked;
		this.distance = distance;
		this.cameFrom = null;
	}

}
