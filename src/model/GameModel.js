import ModelNode from "./basic/ModelNode";
import Vector2 from "./basic/Vector2";
import DirtyValue from "./basic/DirtyValue";
import ControlsModel from "./ControlsModel";
import AssetCache from "../class/AssetCache";
import ResourcesModel from "./resources/ResourcesModel";
import SaveGameModel from "./savegame/SaveGameModel";
import CharacterPreviewModel from "./CharacterPreviewModel";
import EditorModel from "./EditorModel";
import NullableNode from "./basic/NullableNode";

import ResourcesJson from "../resources.json";

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
	 * @type DirtyValue
	 */
	isInDebugMode;

	/**
	 * @type NullableNode
	 */
	saveGame;

	constructor() {
		super();

		this.resources = this.addProperty('resources', new ResourcesModel());
		this.resources.restoreState(ResourcesJson);
		this.assets = new AssetCache(this.resources);
		this.controls = this.addProperty('controls', new ControlsModel());
		this.editor = this.addProperty('editor', new EditorModel());
		this.viewBoxSize = this.addProperty('viewBoxSize', new Vector2());
		this.isInDebugMode = this.addProperty('isInDebugMode', new DirtyValue(true));

		this.saveGame = this.addProperty('saveGame', new NullableNode(() => new SaveGameModel()));
		this.characterPreview = this.addProperty('characterPreview', new CharacterPreviewModel());

		this.initialize();
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

	initialize() {
		this.saveGame.set(new SaveGameModel());
	}

}
