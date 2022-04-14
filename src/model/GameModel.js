import ModelNode from "../node/ModelNode";
import MapModel from "./MapModel";
import Vector2 from "../node/Vector2";
import DirtyValue from "../node/DirtyValue";
import ControlsModel from "./ControlsModel";
import ThreeModel from "./ThreeModel";

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
	isInDebugMode;

	/**
	 * @type ThreeModel
	 */
	three;

	constructor() {
		super();

		this.controls = this.addProperty('controls', new ControlsModel());
		this.map = this.addProperty('map', new MapModel());
		this.viewBoxSize = this.addProperty('viewBoxSize', new Vector2());
		this.isInDebugMode = this.addProperty('isInDebugMode', new DirtyValue(true));
		this.three = this.addProperty('three', new ThreeModel());

	}



}
