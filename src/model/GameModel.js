import ModelNode from "../node/ModelNode";
import MapModel from "./MapModel";
import Vector2 from "../node/Vector2";
import DirtyValue from "../node/DirtyValue";
import ControlsModel from "./ControlsModel";
import ThreeModel from "./ThreeModel";
import AssetCache from "../class/AssetCache";
import ResourcesModel from "./ResourcesModel";
import MaterialCache from "../class/MaterialCache";

export default class GameModel extends ModelNode {

	/**
	 * @type AssetCache
	 */
	assets;

	/**
	 * @type ResourcesModel
	 */
	resources;

	/**
	 * @type MaterialCache
	 */
	materials;

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

		this.assets = new AssetCache();
		this.resources = this.addProperty('resources', new ResourcesModel());
		this.materials = new MaterialCache(this.resources, this.assets);
		this.controls = this.addProperty('controls', new ControlsModel());
		this.map = this.addProperty('map', new MapModel());
		this.viewBoxSize = this.addProperty('viewBoxSize', new Vector2());
		this.isInDebugMode = this.addProperty('isInDebugMode', new DirtyValue(true));
		this.three = this.addProperty('three', new ThreeModel());

	}

}
