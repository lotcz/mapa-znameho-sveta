import ModelNode from "../node/ModelNode";
import DirtyValue from "../node/DirtyValue";
import Vector3 from "../node/Vector3";
import Vector2 from "../node/Vector2";

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

	/**
	 * @type Vector3
	 * this must be applied to orto camera in order to make 3D world fit with 2D background
	 */
	cameraOffset;

	constructor() {
		super();

		this.backgroundImage = this.addProperty('backgroundImage', new DirtyValue('img/desert.jpg'));
		this.tileSize = this.addProperty('tileSize', new DirtyValue(62.77));
		this.cameraOffset = this.addProperty('cameraOffset', new Vector3(-10, 10, -10));

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
		return new Vector2(Math.round(position.x), Math.round(position.y));
	}

}
