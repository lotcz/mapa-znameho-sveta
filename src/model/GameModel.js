import ModelNode from "../node/ModelNode";
import Vector2 from "../node/Vector2";
import DirtyValue from "../node/DirtyValue";
import ControlsModel from "./ControlsModel";
import AssetCache from "../class/AssetCache";
import ResourcesModel from "./ResourcesModel";
import MaterialCache from "../class/MaterialCache";
import SaveGameModel from "./SaveGameModel";
import CharacterPreviewModel from "./CharacterPreviewModel";

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
	 * @type Vector2
	 */
	viewBoxSize;

	/**
	 * @type DirtyValue
	 */
	isInDebugMode;

	/**
	 * @type SaveGameModel
	 */
	saveGame;

	/**
	 * @type CharacterPreviewModel
	 */
	characterPreview;

	constructor() {
		super();

		this.assets = new AssetCache();
		this.resources = this.addProperty('resources', new ResourcesModel());
		this.materials = new MaterialCache(this.resources, this.assets);
		this.controls = this.addProperty('controls', new ControlsModel());
		this.viewBoxSize = this.addProperty('viewBoxSize', new Vector2());
		this.isInDebugMode = this.addProperty('isInDebugMode', new DirtyValue(true));

		this.saveGame = this.addProperty('saveGame', new SaveGameModel());
		this.characterPreview = this.addProperty('characterPreview', new CharacterPreviewModel());

	}

}
