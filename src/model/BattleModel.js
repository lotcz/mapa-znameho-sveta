import ModelNode from "../node/ModelNode";
import Vector2 from "../node/Vector2";
import ModelNodeCollection from "../node/ModelNodeCollection";
import BattleCharacterModel from "./BattleCharacterModel";

export default class BattleModel extends ModelNode {

	/**
	 * @type ModelNodeCollection
	 */
	characters;

	/**
	 * @type Vector2
	 */
	coordinates;

	constructor() {
		super();

		this.characters = this.addProperty('characters', new ModelNodeCollection(() => new BattleCharacterModel()));

		this.coordinates = this.addProperty('coordinates', new Vector2(25, 25));

	}

}
