import CollectionController from "../../basic/CollectionController";
import BattleCharacterController from "./BattleCharacterController";
import NullableNodeController from "../../basic/NullableNodeController";
import BattleMapController from "./BattleMapController";
import AnimationVector2Controller from "../../basic/AnimationVector2Controller";
import SelectedBattleCharacterController from "./SelectedBattleCharacterController";
import {ImageHelper} from "../../../class/basic/ImageHelper";
import ControllerWithSaveGame from "../../basic/ControllerWithSaveGame";
import NpcBattleCharacterController from "./NpcBattleCharacterController";
import Vector2 from "../../../model/basic/Vector2";

export default class BattleController extends ControllerWithSaveGame {

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
			new NullableNodeController(
				this.game,
				this.model.battleMap,
				(m) => new BattleMapController(game, m)
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
			new CollectionController(
				this.game,
				this.model.npcCharacters,
				(m) => new NpcBattleCharacterController(game, m)
			)
		);

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

		this.addAutoEvent(
			this.model.battleMapId,
			'change',
			() => {
				this.model.battleMap.set(this.game.resources.map.battleMaps.getById(this.model.battleMapId.get()));
			}
		);

		this.addAutoEvent(
			this.model,
			'raycast-character',
			(battleCharacter) => {
				this.model.hoveringBattleCharacterRaycast.set(battleCharacter);
			}
		)

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

	activateInternal() {
		this.model.battleMap.set(this.game.resources.map.battleMaps.getById(this.model.battleMapId.get()));
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

		let special = battleMap.specials.find((s) => s.position.equalsTo(tile));
		if (special) {
			if (special.data.isSet()) {
				const linked = this.extractLinkedSpecial(special.data.get());
				if (linked) {
					special = linked;
				}
			}
			this.model.hoveringSpecial.set(special);
		} else {
			this.model.hoveringSpecial.set(null);
		}

		const occupant = this.model.partyCharacters.find((ch) => ch.position.round().equalsTo(tile));
		this.model.hoveringBattleCharacterTile.set(occupant);

		if (occupant) return;

		const npc = this.model.npcCharacters.find((n) => n.position.round().equalsTo(tile));
		this.model.hoveringBattleCharacterTile.set(npc);

	}

	extractLinkedSpecial(data) {
		const battleMap = this.model.battleMap.get();
		const arr = data.split(':');
		if (arr.length > 1 && arr[0] === 'link') {
			const arr2 = arr[1].split(',');
			if (arr2.length > 1) {
				const pos = new Vector2(arr2[0], arr2[1]);
				return battleMap.specials.find((s) => s.position.equalsTo(pos));
			}
		}
		return null;
	}

	onZoom(param) {
		this.model.zoom.set(Math.max(this.model.zoom.get() + (param * -0.1), 0.05));
	}

	onClick() {
		if (this.model.isMouseOver.get() === false) {
			return;
		}

		const occupant = this.model.hoveringBattleCharacter.get();
		const isParty = occupant && this.model.partyCharacters.contains(occupant);

		if (isParty) {
			this.saveGame.party.triggerEvent('character-selected', occupant.characterId.get());
			return;
		}

		const character = this.model.partyCharacters.selectedNode.get();
		if (!character) return;

		if (occupant && occupant.character.get().npcConversationId.isSet()) {
			character.triggerEvent('talk-to', occupant);
			return;
		}

		const special = this.model.hoveringSpecial.get();
		if (special) {
			character.triggerEvent('go-to', special.position);
			return;
		}

		character.triggerEvent('go-to', this.model.mouseHoveringTile);
	}
}
