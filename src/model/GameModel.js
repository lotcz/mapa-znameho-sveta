import ModelNode from "./basic/ModelNode";
import Vector2 from "./basic/Vector2";
import DirtyValue from "./basic/DirtyValue";
import ControlsModel from "./ControlsModel";
import AssetCache from "../class/AssetCache";
import ResourcesModel from "./resources/ResourcesModel";
import SaveGameModel from "./savegame/SaveGameModel";
import CharacterPreviewModel, {SEX_MAMMOTH, SEX_WOLF} from "./CharacterPreviewModel";
import BattleModel from "./battle/BattleModel";
import WaypointModel from "./resources/WaypointModel";
import TextureModel from "./resources/TextureModel";
import MaterialModel from "./resources/MaterialModel";
import EditorModel from "./editor/EditorModel";

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
	 * @type SaveGameModel
	 */
	saveGame;

	constructor() {
		super();

		this.resources = this.addProperty('resources', new ResourcesModel());
		this.assets = new AssetCache(this.resources);
		this.controls = this.addProperty('controls', new ControlsModel());
		this.editor = this.addProperty('editor', new EditorModel());
		this.viewBoxSize = this.addProperty('viewBoxSize', new Vector2());
		this.isInDebugMode = this.addProperty('isInDebugMode', new DirtyValue(true));

		this.saveGame = this.addProperty('saveGame', new SaveGameModel());
		this.characterPreview = this.addProperty('characterPreview', new CharacterPreviewModel());

		this.initialize();
	}

	initialize() {

		const path = this.resources.map.paths.add();

		const w1 = path.waypoints.add(new WaypointModel());
		w1.coordinates.set(245, 250);
		w1.a.set(255, 225);
		w1.b.set(265, 285);

		const w2 = path.waypoints.add(new WaypointModel());
		w2.coordinates.set(450, 450);
		w2.a.set(455, 425);
		w2.b.set(445, 485);

		const w3 = path.waypoints.add(new WaypointModel());
		w3.coordinates.set(500, 700);
		w3.a.set(585, 725);
		w3.b.set(565, 785);

		const w4 = path.waypoints.add(new WaypointModel());
		w4.coordinates.set(1250, 380);
		w4.a.set(1205, 725);
		w4.b.set(1185, 885);

		const path2 = this.resources.map.paths.add();

		const w5 = path2.waypoints.add(new WaypointModel());
		w5.coordinates.set(145, 150);
		w5.a.set(155, 125);
		w5.b.set(165, 185);

		const w6 = path2.waypoints.add(new WaypointModel());
		w6.coordinates.set(50, 50);
		w6.a.set(55, 125);
		w6.b.set(45, 85);

		const location = this.resources.map.locations.add();
		location.name.set('Location');
		location.coordinates.set(550, 450);
		const conn = location.connections.add();
		conn.pathId.set(path.id.get());

		const location2 = this.resources.map.locations.add();
		location2.name.set('Location 2');
		location2.coordinates.set(1550, 450);
		const conn2 = location2.connections.add();
		conn2.pathId.set(path.id.get());
		conn2.forward.set(false);
		const conn3 = location2.connections.add();
		conn3.pathId.set(path2.id.get());
		conn3.forward.set(false);







		const texture = new TextureModel();
		texture.uri.set('img/paper-texture.jpg');
		const material = new MaterialModel(1, 'paper-texture.jpg');
		material.texture.set(texture);
		this.resources.materials.add(material);

		const character = this.saveGame.battle.characters.add();
		character.position.set(-27, 0);
		character.scale.set(1.2, 0.9, 1.2);

		const character2 = this.saveGame.battle.characters.add();
		//character2.sex.set(SEX_MALE);
		character2.position.set(-22, -4);
		character2.skinColor.set('#5050a0');

		const character3 = this.saveGame.battle.characters.add();
		//character3.sex.set(SEX_MALE);
		character3.position.set(-30, 3);
		character3.skinColor.set('#905020');
		character3.scale.set(1.1, 0.7, 1.1);

		const wolf = this.saveGame.battle.characters.add();
		wolf.sex.set(SEX_WOLF);
		wolf.position.set(-20, -13);
		wolf.skinColor.set('#505050');
		wolf.scale.set(1, 1, 1);

		const mammoth = this.saveGame.battle.characters.add();
		mammoth.sex.set(SEX_MAMMOTH);
		mammoth.position.set(-10, -7);
		mammoth.skinColor.set('#505050');
		mammoth.scale.set(1, 1, 1);
	}

}
