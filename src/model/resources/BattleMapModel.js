import ModelNode from "../basic/ModelNode";
import DirtyValue from "../basic/DirtyValue";
import Vector3 from "../basic/Vector3";
import Vector2 from "../basic/Vector2";

export default class BattleMapModel extends ModelNode {

	/**
	 * @type DirtyValue
	 * path to image asset
	 */
	backgroundImage;

	/**
	 * @type DirtyValue
	 * size of one battle tile in pixels, as it would be in background image when scale is 1 and not in isometric view
	 */
	tileSize;

	constructor() {
		super();

		this.backgroundImage = this.addProperty('backgroundImage', new DirtyValue('img/camp.jpg'));
		this.tileSize = this.addProperty('tileSize', new DirtyValue(62.77));

	}

	/**
	 * @param {Vector2} coords
	 * @returns {Vector2}
	 */
	screenCoordsToPosition(coords) {
		const w = this.tileSize.get();
		const result = new Vector2();

		const tileWidthHalf = 0.815 * 0.5 * Math.sqrt(3) * w;
		const tileHeightHalf = 0.815 * 0.5 * w;

		result.x = 0.5 * ((-coords.x / tileWidthHalf) + (-coords.y / tileHeightHalf));
		result.y = 0.5 * ((coords.x / tileWidthHalf) + (-coords.y / tileHeightHalf));

		return result;
	}

	/**
	 * @param {Vector2} coords
	 * @returns {Vector2}
	 */
	screenCoordsToTile(coords) {
		const position = this.screenCoordsToPosition(coords);
		return position.round();
	}

}
