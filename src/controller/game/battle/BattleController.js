import CollectionController from "../../basic/CollectionController";
import BattleCharacterController from "./BattleCharacterController";
import NullableNodeController from "../../basic/NullableNodeController";
import BattleMapController from "./BattleMapController";
import AnimationVector2Controller from "../../basic/AnimationVector2Controller";
import SelectedBattleCharacterController from "./SelectedBattleCharacterController";
import {ImageHelper} from "../../../class/basic/ImageHelper";
import ControllerSavedGameNode from "../../basic/ControllerSavedGameNode";

export default class BattleController extends ControllerSavedGameNode {

	/**
	 * @type BattleModel
	 */
	model;

	constructor(game, model, saveGame) {
		super(game, model, saveGame);

		this.model = model;
		this.dragging = false;
		this.scrolling = false;

		this.addChild(
			new CollectionController(
				this.game,
				this.model.partyCharacters,
				(m) => new BattleCharacterController(game, m)
			)
		);

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.partyCharacters.selectedNode,
				(m) => new SelectedBattleCharacterController(game, m, this.saveGame, this.model)
			)
		);

		this.addChild(
			new CollectionController(
				this.game,
				this.model.npcCharacters,
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

		this.addAutoEventMultiple(
			[this.game.mainLayerSize, this.model.coordinates, this.model.zoom],
			'change',
			() => {
				this.model.coordinates.set(
					ImageHelper.sanitizeCenter(
						this.model.battleMap.get().size,
						this.game.mainLayerSize,
						this.model.zoom.get(),
						this.model.coordinates
					)
				);
				const halfScreenSize = this.game.mainLayerSize.multiply(0.5 / this.model.zoom.get());
				this.model.cornerCoordinates.set(this.model.coordinates.subtract(halfScreenSize));
				this.onMouseMove();
			},
			true
		);

		this.addAutoEventMultiple(
			[this.model.zoom, this.game.mainLayerSize],
			'change',
			() => {
				this.model.zoom.set(
					ImageHelper.sanitizeZoom(
						this.model.battleMap.get().size,
						this.game.mainLayerSize,
						this.model.zoom.get(),
						1
					)
				);
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

		this.addAutoEvent(
			this.game.controls,
			'zoom',
			(param) => this.onZoom(param)
		);

		const save = this.saveGame;

		this.addAutoEvent(
			save.party.selectedCharacterId,
			'change',
			() => {
				this.model.partyCharacters.selectedNode.set(this.model.partyCharacters.find((chr) => chr.characterId.equalsTo(save.party.selectedCharacterId)));
			},
			true
		);

		this.addAutoEvent(
			this.model.partyCharacters.selectedNode,
			'change',
			() => {
				const character = this.model.partyCharacters.selectedNode.get();
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
				this.saveGame.triggerEvent('to-map');
			}
		);

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

		const occupant = this.model.partyCharacters.find((ch) => ch.position.round().equalsTo(tile));
		this.model.isHoveringPartyCharacter.set(occupant);

		const special = battleMap.specials.find((s) => s.position.equalsTo(tile));
		if (special) {
			this.model.hoveringSpecial.set(special.type.get());
		} else {
			this.model.hoveringSpecial.set(null);
		}
	}

	onZoom(param) {
		this.model.zoom.set(Math.max(this.model.zoom.get() + (param * -0.1), 0.05));
	}

	onClick() {

		if (this.model.isMouseOver.get() === false) {
			return;
		}

		const tile = this.model.mouseHoveringTile

		const occupant = this.model.partyCharacters.find((ch) => ch.position.round().equalsTo(tile));
		if (occupant) {
			const save = this.game.saveGame.get();
			save.party.triggerEvent('character-selected', occupant.characterId.get());
		} else {
			const character = this.model.partyCharacters.selectedNode.get();
			if (character) {
				character.triggerEvent('go-to', tile);
			}
		}
	}
}
