import ModelNode from "../node/ModelNode";
import Vector2 from "../node/Vector2";
import DirtyValue from "../node/DirtyValue";
import ControlsModel from "./ControlsModel";
import AssetCache from "../class/AssetCache";
import ResourcesModel from "./ResourcesModel";
import SaveGameModel from "./SaveGameModel";
import CharacterPreviewModel from "./CharacterPreviewModel";
import BattleModel from "./BattleModel";
import WaypointModel from "./WaypointModel";
import TextureModel from "./TextureModel";
import MaterialModel from "./MaterialModel";

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

	/**
	 * @type BattleModel
	 */
	battle;

	constructor() {
		super();

		this.resources = this.addProperty('resources', new ResourcesModel());
		this.assets = new AssetCache(this.resources);
		this.controls = this.addProperty('controls', new ControlsModel());
		this.viewBoxSize = this.addProperty('viewBoxSize', new Vector2());
		this.isInDebugMode = this.addProperty('isInDebugMode', new DirtyValue(true));

		this.saveGame = this.addProperty('saveGame', new SaveGameModel());
		this.characterPreview = this.addProperty('characterPreview', new CharacterPreviewModel());
		this.battle = this.addProperty('battle', new BattleModel());

		this.initialize();
	}

	initialize() {

		const location = this.resources.map.locations.createNode();
		location.name = 'Location';
		location.coordinates.set(550, 450);
		const conn = location.connections.add();
		conn.pathId.set(1);

		const location2 = this.resources.map.locations.createNode();
		location2.name = 'Location 2';
		location2.coordinates.set(1550, 450);
		const conn2 = location2.connections.add();
		conn2.pathId.set(1);
		conn2.forward.set(false);
		const conn3 = location2.connections.add();
		conn3.pathId.set(2);
		conn3.forward.set(false);

		const path = this.resources.map.paths.createNode();
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

		const path2 = this.resources.map.paths.createNode();
		const w5 = path2.waypoints.add(new WaypointModel());
		w5.coordinates.set(145, 150);
		w5.a.set(155, 125);
		w5.b.set(165, 185);

		const w6 = path2.waypoints.add(new WaypointModel());
		w6.coordinates.set(50, 50);
		w6.a.set(55, 125);
		w6.b.set(45, 85);

		const texture = new TextureModel();
		texture.uri.set('img/paper-texture.jpg');
		const material = new MaterialModel(1, 'paper-texture.jpg');
		material.texture.set(texture);
		this.resources.materials.add(material);

		const character = this.battle.characters.add();
		character.coordinates.set(700, 700);

		const character2 = this.battle.characters.add();
		//character2.sex.set(SEX_MALE);
		character2.coordinates.set(800, 500);
		character2.skinColor.set('#5050a0');

		const character3 = this.battle.characters.add();
		//character3.sex.set(SEX_MALE);
		character3.coordinates.set(700, 400);
		character3.skinColor.set('#905020');

	}

}
