import DirtyValue from "../../basic/DirtyValue";
import Vector2 from "../../basic/Vector2";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import IntValue from "../../basic/IntValue";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import BattleSpriteModel from "./BattleSpriteModel";

export default class BattleMapModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 * path to image asset
	 */
	backgroundImage;

	/**
	 * @type IntValue
	 * size of one battle tile in pixels, as it would be in background image when scale is 1 and not in isometric view
	 */
	tileSize;

	/**
	 * @type Vector2
	 */
	start;

	/**
	 * @type ModelNodeCollection
	 */
	sprites;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Battle Map ${id}`));
		this.backgroundImage = this.addProperty('backgroundImage', new DirtyValue('img/camp.jpg'));
		this.tileSize = this.addProperty('tileSize', new IntValue(70/*62.77*/));

		this.start = this.addProperty('start', new Vector2(-102, -25));

		this.sprites = this.addProperty('sprites', new ModelNodeCollection(() => new BattleSpriteModel()));

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
