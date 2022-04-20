import ModelNode from "../node/ModelNode";
import Vector2 from "../node/Vector2";
import ModelNodeCollection from "../node/ModelNodeCollection";
import BattleCharacterModel from "./BattleCharacterModel";
import BattleMapModel from "./BattleMapModel";
import DirtyValue from "../node/DirtyValue";

export default class BattleModel extends ModelNode {

	/**
	 * @type BattleMapModel
	 */
	battleMap;

	/**
	 * @type ModelNodeCollection
	 */
	characters;

	/**
	 * @type Vector2
	 * current coordinates of center of the screen, in px of background image
	 */
	coordinates;

	/**
	 * @type DirtyValue
	 * Scale of currently displayed battlemap
	 */
	zoom;

	constructor() {
		super();

		this.characters = this.addProperty('characters', new ModelNodeCollection(() => new BattleCharacterModel()));
		this.battleMap = this.addProperty('battleMap', new BattleMapModel());
		this.coordinates = this.addProperty('coordinates', new Vector2(800, 700));
		this.zoom = this.addProperty('zoom', new DirtyValue(1));

	}

}
