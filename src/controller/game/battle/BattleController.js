import ControllerNode from "../../basic/ControllerNode";
import CollectionController from "../../basic/CollectionController";
import BattleCharacterController from "./BattleCharacterController";
import NullableNodeController from "../../basic/NullableNodeController";
import BattleMapController from "./BattleMapController";
import {GAME_MODE_MAP} from "../../../model/game/SaveGameModel";
import AnimationVector2Controller from "../../basic/AnimationVector2Controller";
import SelectedBattleCharacterController from "./SelectedBattleCharacterController";
import Pixies from "../../../class/basic/Pixies";

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
				this.model.characters.selectedNode,
				(m) => new SelectedBattleCharacterController(game, m)
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
			this.model.coordinates,
			'change',
			() => {
				this.updateCoordinates();
			},
			true
		);

		this.addAutoEvent(
			this.model.zoom,
			'change',
			() => {
				this.updateCoordinates();
			}
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

		this.addAutoEvent(
			this.game.controls,
			'zoom',
			(param) => this.onZoom(param)
		);

		this.addAutoEvent(
			this.model.characters.selectedNode,
			'change',
			() => {
				const character = this.model.characters.selectedNode.get();
				if (character) {
					const battleMap = this.model.battleMap.get();
					const coords = battleMap.positionToScreenCoords(character.position);
					this.addChild(new AnimationVector2Controller(this.game, this.model.coordinates, coords, 500));
				}
			},
			true
		);

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

	updateCoordinates() {
		const halfScreenSize = this.game.mainLayerSize.multiply(0.5 / this.model.zoom.get());
		const x = Pixies.between(halfScreenSize.x, this.model.battleMap.get().size.x - halfScreenSize.x, this.model.coordinates.x);
		const y = Pixies.between(halfScreenSize.y, this.model.battleMap.get().size.y - halfScreenSize.y, this.model.coordinates.y);
		this.model.coordinates.set(x, y);
		this.model.cornerCoordinates.set(this.model.coordinates.subtract(halfScreenSize));
	}

	activateInternal() {
		this.model.coordinates.makeDirty();

		const save = this.game.saveGame.get();
		this.model.characters.selectedNode.set(this.model.characters.find((chr) => chr.characterId.equalsTo(save.party.selectedCharacterId)));
	}

	updateInternal(delta) {
		// dragging and scrolling
		if (!this.game.controls.mouseDownLeft.get()) {
			this.dragging = false;
		}
		if (!this.game.controls.mouseDownRight.get()) {
			this.scrolling = false;
		}
		this.mouseMoved = false;
	}

	onMouseMove() {
		if (this.mouseMoved) return;
		this.runOnUpdate( () => {
			const corner = this.model.coordinates.subtract(this.game.mainLayerSize.multiply(0.5 / this.model.zoom.get()));
			const coords = corner.add(this.game.mainLayerMouseCoordinates.multiply(1 / this.model.zoom.get()));
			this.model.mouseCoordinates.set(coords);
		});
		this.mouseMoved = true;
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
		const tile = this.model.mouseHoveringTile;
		const blocked = battleMap.isTileBlocked(tile);
		this.model.isHoveringNoGo.set(blocked);

		const occupant = this.model.characters.find((ch) => ch.position.round().equalsTo(tile));
		this.model.isHoveringPartyCharacter.set(occupant);
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
			const save = this.game.saveGame.get();
			save.party.triggerEvent('character-selected', occupant.characterId.get());
		} else {
			const character = this.getSelectedBattleCharacter()
			if (character) {
				character.triggerEvent('go-to', tile);
			}
		}
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
