import ControllerNode from "../../basic/ControllerNode";
import DirtyValue from "../../../model/basic/DirtyValue";
import CollectionController from "../../basic/CollectionController";
import PathController from "./PathController";
import LocationController from "./LocationController";
import NullableNodeController from "../../basic/NullableNodeController";
import CurrentLocationController from "./CurrentLocationController";
import CurrentPathController from "./CurrentPathController";
import BattleModel from "../../../model/game/battle/BattleModel";
import {GAME_MODE_BATTLE} from "../../../model/game/SaveGameModel";
import Vector2 from "../../../model/basic/Vector2";
import Pixies from "../../../class/basic/Pixies";
import BattlePartyCharacterModel from "../../../model/game/battle/BattlePartyCharacterModel";
import BattleNpcCharacterModel from "../../../model/game/battle/BattleNpcCharacterModel";

export default class MapController extends ControllerNode {

	/**
	 * @type SaveGameModel
	 */
	model;

	/**
	 * @type MapModel
	 */
	map;

	dragging;

	scrolling;

	/**
	 * @type DirtyValue
	 */
	focusedHelper;

	constructor(game, saveGame) {
		super(game, saveGame);

		this.model = saveGame;
		this.map = game.resources.map;

		this.dragging = false;
		this.scrolling = false;

		this.focusedHelper = new DirtyValue(null);

		this.pathsController = new CollectionController(this.game, this.game.resources.map.paths, (m) => new PathController(this.game, m));
		this.addChild(this.pathsController);

		this.locationsController = new CollectionController(this.game, this.game.resources.map.locations, (m) => new LocationController(this.game, m));
		this.addChild(this.locationsController);

		this.addChild(new NullableNodeController(this.game, this.model.currentPath, (m) => new CurrentPathController(this.game, m)));
		this.addChild(new NullableNodeController(this.game, this.model.currentLocation, (m) => new CurrentLocationController(this.game, m)));

		this.addAutoEvent(
			this.model.currentPathId,
			'change',
			() => {
				this.runOnUpdate(() => this.model.currentPath.set(this.map.paths.getById(this.model.currentPathId.get())));
			},
			true
		);

		this.addAutoEvent(
			this.model.currentLocationId,
			'change',
			() => {
				this.runOnUpdate(() => this.model.currentLocation.set(this.map.locations.getById(this.model.currentLocationId.get())));
			},
			true
		);

		this.addAutoEvent(
			this.model,
			'to-battle',
			() => {
				this.runOnUpdate(() => this.toBattle());
			}
		);

		this.helperMouseOverHandler = (point) => this.focusedHelper.set(point);
		this.helperMouseOutHandler = (point) => {
			if (this.focusedHelper.equalsTo(point)) {
				this.focusedHelper.set(null);
			}
		};

		this.mouseMoveHandler = () => this.runOnUpdate(() => this.onMouseMove());
		this.zoomHandler = (param) => this.onZoom(param);

		this.resourcesChangedHandler = () => {
			this.model.makeDirty();
		};
	}

	activateInternal() {
		this.game.addEventListener('helperMouseOver', this.helperMouseOverHandler);
		this.game.addEventListener('helperMouseOut', this.helperMouseOutHandler);

		this.game.mainLayerMouseCoordinates.addOnChangeListener(this.mouseMoveHandler);
		this.game.controls.addEventListener('zoom', this.zoomHandler);

		this.map.addOnDirtyListener(this.resourcesChangedHandler);
	}

	deactivateInternal() {
		this.game.removeEventListener('helperMouseOver', this.helperMouseOverHandler);
		this.game.removeEventListener('helperMouseOut', this.helperMouseOutHandler);

		this.game.mainLayerMouseCoordinates.removeOnChangeListener(this.mouseMoveHandler);
		this.game.controls.removeEventListener('zoom', this.zoomHandler);

		this.map.removeOnDirtyListener(this.resourcesChangedHandler);
	}

	updateInternal(delta) {
		super.updateInternal(delta);

		// dragging and scrolling
		if (!this.game.controls.mouseDownLeft.get()) {
			this.dragging = false;
		}
		if (!this.game.controls.mouseDownRight.get()) {
			this.scrolling = false;
		}


	}

	onMouseMove() {
		if (this.game.controls.mouseDownLeft.get()) {
			this.model.partyTraveling.set(false);
			if (this.dragging) {
				const mapCoords = this.model.coordinates.add(this.game.mainLayerMouseCoordinates.multiply(this.model.zoom.get()));
				this.dragging.set(mapCoords);
			} else if (this.focusedHelper.isSet()) {
				this.dragging = this.focusedHelper.get();
			}
		}

		if (this.game.controls.mouseDownRight.get()) {
			this.model.partyTraveling.set(false);
			if (this.scrolling) {
				const offset = this.game.mainLayerMouseCoordinates.subtract(this.scrolling);
				const mapCoords = this.model.coordinates.subtract(offset.multiply(this.model.zoom.get()));
				this.model.coordinates.set(mapCoords);
				this.scrolling = this.game.mainLayerMouseCoordinates.clone();
			} else {
				this.scrolling = this.game.mainLayerMouseCoordinates.clone();
			}
		}
	}

	onZoom(param) {
		this.model.zoom.set(this.model.zoom.get() + (param * 0.1));
	}

	toBattle() {
		const location = this.model.currentLocation.get();
		const battleMapId = location.battleMapId.get();
		const map = this.game.resources.map.battleMaps.getById(battleMapId);

		let battle = this.model.battles.find((b) => b.battleMapId.equalsTo(battleMapId));

		// create battle
		if (!battle) {
			battle = new BattleModel();
			battle.battleMapId.set(battleMapId);

			// create NPCs
			map.npcSpawns.forEach(
				(spawn) => {
					const template = this.game.resources.characterTemplates.getById(spawn.characterTemplateId);
					if (!template) {
						console.log('No character template found ', spawn.characterTemplateId.get());
						return;
					}
					const character = this.model.characters.add(template.clone());
					const npc = new BattleNpcCharacterModel();
					npc.characterId.set(character.id.get());
					npc.position.set(spawn.position);
					battle.npcCharacters.add(npc);
				}
			);

			this.model.battles.add(battle);
		}

		// create party
		const center = map.screenCoordsToPosition(map.size.multiply(0.5));
		battle.partyCharacters.reset();
		this.model.party.slots.forEach((slot) => {
			const character = new BattlePartyCharacterModel();
			character.characterId.set(slot.characterId.get());
			const position = center.add(new Vector2(Pixies.random(-5, 5), Pixies.random(-5, 5))).round();
			character.position.set(position);
			battle.partyCharacters.add(character);
		});

		this.model.currentBattleMapId.set(battleMapId);

		//this.model.currentBattle.set(battle);
		this.model.mode.set(GAME_MODE_BATTLE);
	}

}
