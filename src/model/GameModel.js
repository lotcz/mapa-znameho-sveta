import ModelNode from "../node/ModelNode";
import MapModel from "./MapModel";
import Vector2 from "../node/Vector2";
import DirtyValue from "../node/DirtyValue";
import ControlsModel from "./ControlsModel";

export default class GameModel extends ModelNode {

	/**
	 * @type ControlsModel
	 */
	controls;

	/**
	 * @type MapModel
	 */
	map;

	/**
	 * @type Vector2
	 */
	viewBoxSize;

	/**
	 * @type DirtyValue
	 */
	isInEditMode;

	constructor() {
		super();

		this.controls = this.addProperty('controls', new ControlsModel());
		this.map = this.addProperty('map', new MapModel());
		this.viewBoxSize = this.addProperty('viewBoxSize', new Vector2());
		this.isInEditMode = this.addProperty('isInEditMode', new DirtyValue(true));

	}



}
