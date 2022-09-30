import ControllerNode from "../../basic/ControllerNode";
import CollectionController from "../../basic/CollectionController";
import BattleCharacterController from "./BattleCharacterController";
import NullableNodeController from "../../basic/NullableNodeController";
import BattleMapController from "./BattleMapController";
import {GAME_MODE_MAP} from "../../../model/game/SaveGameModel";

export default class BattleController extends ControllerNode {

	/**
	 * @type BattleModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;
		this.dragging = false;
		this.scrolling = false;

		this.addChild(
			new CollectionController(
				this.game,
				this.model.characters,
				(m) => new BattleCharacterController(game, m)
			)
		);

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.battleMap,
				(m) => new BattleMapController(game, m)
			)
		);

		this.addAutoEvent(
			this.model.battleMapId,
			'change',
			() => {
				this.model.battleMap.set(this.game.resources.map.battleMaps.getById(this.model.battleMapId));
			},
			true
		);

		this.addAutoEvent(
			this.game.mainLayerMouseCoordinates,
			'change',
			() => this.onMouseMove(),
			true
		);

		this.addAutoEvent(
			this.model.mouseCoordinates,
			'change',
			() => this.onMouseCoordinatesChanged(),
			true
		);

		this.addAutoEvent(
			this.model.mouseHoveringTile,
			'change',
			() => this.onHoveringTileChanged(),
			true
		);

		this.addAutoEvent(
			this.game.controls,
			'left-click',
			() => this.onClick()
		);

		this.zoomHandler = (param) => this.onZoom(param);
		this.clickHandler = (param) => this.onClick(param);



		this.addAutoEvent(
			this.model,
			'leave-battle',
			() => {
				const save = this.game.saveGame.get();
				// delete party characters from battle
				const partyCharacters = this.model.characters.filter((chr) => save.party.hasCharacter(chr.characterId));
				partyCharacters.forEach((chr) => this.model.characters.remove(chr));

				save.mode.set(GAME_MODE_MAP);
				save.currentBattle.set(null);
			}
		);

	}

	activateInternal() {
		this.model.coordinates.makeDirty();

		this.game.controls.addEventListener('zoom', this.zoomHandler);
		this.game.controls.addOnLeftClickListener(this.clickHandler);

		const save = this.game.saveGame.get();
		this.model.characters.selectedNode.set(this.model.characters.find((chr) => chr.characterId.equalsTo(save.party.selectedCharacterId)));
	}

	deactivateInternal() {
		this.game.controls.removeEventListener('zoom', this.zoomHandler);
		this.game.controls.removeOnLeftClickListener(this.clickHandler);
	}

	updateInternal(delta) {
		// dragging and scrolling
		if (!this.game.controls.mouseDownLeft.get()) {
			this.dragging = false;
		}
		if (!this.game.controls.mouseDownRight.get()) {
			this.scrolling = false;
		}
	}

	onMouseMove() {
		const corner = this.model.coordinates.subtract(this.game.mainLayerSize.multiply(0.5 / this.model.zoom.get()));
		const coords = corner.add(this.game.mainLayerMouseCoordinates.multiply(1 / this.model.zoom.get()));
		this.model.mouseCoordinates.set(coords);
	}

	onMouseCoordinatesChanged() {
		const battleMap = this.model.battleMap.get();
		const tile = battleMap.screenCoordsToTile(this.model.mouseCoordinates);
		this.model.mouseHoveringTile.set(tile);

		if (this.game.controls.mouseDownRight.get()) {
			if (this.scrolling) {
				const offset = this.model.mouseCoordinates.subtract(this.scrolling);
				const mapCoords = this.model.coordinates.subtract(offset);
				this.model.coordinates.set(mapCoords);
				const mouseCoords = this.model.mouseCoordinates.subtract(offset);
				this.model.mouseCoordinates.set(mouseCoords);
			}
			this.scrolling = this.model.mouseCoordinates.clone();
		}
	}

	onHoveringTileChanged() {
		const battleMap = this.model.battleMap.get();
		const blocked = battleMap.isTileBlocked(this.model.mouseHoveringTile);
		this.model.isHoveringNoGo.set(blocked);
	}

	onZoom(param) {
		this.model.zoom.set(Math.max(this.model.zoom.get() + (param * -0.1), 0.05));
	}

	onClick() {

		if (this.model.isMouseOver.get() === false) {
			return;
		}

		const tile = this.model.mouseHoveringTile

		const occupant = this.model.characters.find((ch) => ch.position.round().equalsTo(tile));
		if (occupant) {
			this.switchCharacter(occupant.characterId.get());
		} else {
			const character = this.getSelectedBattleCharacter()
			if (character) {
				character.triggerEvent('go-to', tile);
			}
		}
	}

	switchCharacter(characterId) {
		this.game.saveGame.get().party.selectedCharacterId.set(characterId);
	}

	getBattleCharacter(characterId) {
		if (!characterId) {
			return null;
		}
		return this.model.characters.find((ch) => ch.characterId.equalsTo(characterId));
	}

	getSelectedBattleCharacter() {
		const selected = this.game.saveGame.get().party.selectedCharacterId.get();
		return this.getBattleCharacter(selected);
	}

}
