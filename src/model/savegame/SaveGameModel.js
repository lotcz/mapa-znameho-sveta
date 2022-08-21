import ModelNode from "../basic/ModelNode";
import DirtyValue from "../basic/DirtyValue";
import Vector2 from "../basic/Vector2";
import BattleModel from "../battle/BattleModel";
import WaypointModel from "../resources/WaypointModel";
import TextureModel from "../resources/TextureModel";
import MaterialModel from "../resources/MaterialModel";
import {SEX_MAMMOTH, SEX_WOLF} from "../CharacterPreviewModel";
import NullableNode from "../basic/NullableNode";
import RunningConversationModel from "./conversation/RunningConversationModel";

export const GAME_MODE_MAP = 'map';
export const GAME_MODE_BATTLE = 'battle';

export default class SaveGameModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	mode;

	/**
	 * @type Vector2
	 * current scroll position
	 */
	coordinates;

	/**
	 * @type DirtyValue
	 */
	zoom;

	/**
	 * @type DirtyValue
	 */
	forward;

	/**
	 * @type DirtyValue
	 */
	currentPathId;

	/**
	 * @type DirtyValue
	 */
	pathProgress;

	/**
	 * @type BattleModel
	 */
	battle;

	/**
	 * @type NullableNode
	 */
	runningConversation;

	constructor() {
		super();

		this.mode = this.addProperty('mode', new DirtyValue(GAME_MODE_MAP));
		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.zoom = this.addProperty('zoom', new DirtyValue(1));
		this.forward = this.addProperty('forward', new DirtyValue(true));
		this.currentPathId = this.addProperty('currentPathId', new DirtyValue(1));
		this.pathProgress = this.addProperty('pathProgress', new DirtyValue(0));

		this.battle = this.addProperty('battle', new BattleModel());

		this.runningConversation = this.addProperty('runningConversation', new NullableNode(() => new RunningConversationModel()));
	}

}
