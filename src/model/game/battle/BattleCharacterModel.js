import DirtyValue from "../../basic/DirtyValue";
import ModelNode from "../../basic/ModelNode";
import Vector2 from "../../basic/Vector2";
import Rotation from "../../basic/Rotation";
import IntValue from "../../basic/IntValue";
import NullableNode from "../../basic/NullableNode";

export const CHARACTER_STATE_IDLE = 'Idle';
export const CHARACTER_STATE_RUN = 'Run';
export const CHARACTER_STATE_SWORD = 'Sword';

export default class BattleCharacterModel extends ModelNode {

	/**
	 * @type Vector2
	 */
	position;

	/**
	 * @type NullableNode<Vector2>
	 */
	targetPosition;

	/**
	 * @type Rotation
	 */
	rotation;

	/**
	 * @type DirtyValue
	 */
	state;

	/**
	 * @type IntValue
	 */
	characterId;

	/**
	 * @type NullableNode<CharacterModel>
	 */
	character;

	constructor() {
		super();

		this.position = this.addProperty('position', new Vector2(0, 0));
		this.targetPosition = this.addProperty('targetPosition', new NullableNode(null, false));
		this.rotation = this.addProperty('rotation', new Rotation(0));
		this.state = this.addProperty('state', new DirtyValue(CHARACTER_STATE_IDLE, false));
		this.characterId = this.addProperty('characterId', new IntValue());
		this.character = this.addProperty('character', new NullableNode(null, false));
	}

}
