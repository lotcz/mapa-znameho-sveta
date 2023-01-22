import ModelNode from "../basic/ModelNode";
import Vector2 from "../basic/Vector2";
import ControlsModel from "./ControlsModel";
import AssetCache from "../../class/AssetCache";
import ResourcesModel from "./ResourcesModel";
import SaveGameModel from "./SaveGameModel";
import EditorModel from "../editor/EditorModel";
import NullableNode from "../basic/NullableNode";

import ResourcesJson from "../../resources.json";
import BoolValue from "../basic/BoolValue";
import GlobalAudioModel from "../audio/GlobalAudioModel";

export default class GameModel extends ModelNode {

	/**
	 * @type BoolValue
	 */
	isInDebugMode;

	/**
	 * @type AssetCache
	 */
	assets;

	/**
	 * @type ResourcesModel
	 */
	resources;

	/**
	 * @type ControlsModel
	 */
	controls;

	/**
	 * @type EditorModel
	 */
	editor;

	/**
	 * @type Vector2
	 */
	viewBoxSize;

	/**
	 * @type Vector2
	 */
	mainLayerSize;

	/**
	 * @type Vector2
	 */
	mainLayerMouseCoordinates;

	/**
	 * @type NullableNode
	 */
	saveGame;

	/**
	 * @type GlobalAudioModel
	 */
	audio;

	constructor() {
		super();

		this.isInDebugMode = this.addProperty('isInDebugMode', new BoolValue(true));
		this.resources = this.addProperty('resources', new ResourcesModel());
		this.resources.restoreState(ResourcesJson);
		this.assets = new AssetCache(this.resources);
		this.controls = this.addProperty('controls', new ControlsModel());
		this.editor = this.addProperty('editor', new EditorModel());
		this.viewBoxSize = this.addProperty('viewBoxSize', new Vector2());
		this.mainLayerSize = this.addProperty('mainLayerSize', new Vector2());
		this.mainLayerMouseCoordinates = this.addProperty('mainLayerMouseCoordinates', new Vector2());

		this.saveGame = this.addProperty('saveGame', new NullableNode(() => new SaveGameModel()));
		this.saveGame.set(new SaveGameModel());

		this.audio = this.addProperty('audio', new GlobalAudioModel());
	}

	getTableByName(name) {
		if (this.resources[name]) {
			return this.resources[name];
		}
		if (this.resources.map[name]) {
			return this.resources.map[name];
		}
		if (this.saveGame.isEmpty()) {
			return null;
		}
		if (this.saveGame.get()[name]) {
			return this.saveGame.get()[name];
		}
		if (this.saveGame.get().party[name]) {
			return this.saveGame.get().party[name];
		}
		return null;
	}

}
