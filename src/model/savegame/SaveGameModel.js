import ModelNode from "../basic/ModelNode";
import DirtyValue from "../basic/DirtyValue";
import Vector2 from "../basic/Vector2";

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

	constructor() {
		super();

		this.mode = this.addProperty('mode', new DirtyValue(GAME_MODE_MAP));
		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.zoom = this.addProperty('zoom', new DirtyValue(1));
		this.forward = this.addProperty('forward', new DirtyValue(true));
		this.currentPathId = this.addProperty('currentPathId', new DirtyValue(1));
		this.pathProgress = this.addProperty('pathProgress', new DirtyValue(0));

	}

}
