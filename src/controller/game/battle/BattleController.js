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
import {
	CURSOR_TYPE_ATTACK,
	CURSOR_TYPE_DEFAULT,
	CURSOR_TYPE_EXIT,
	CURSOR_TYPE_EYE,
	CURSOR_TYPE_SWITCH_CHARACTER,
	CURSOR_TYPE_TALK,
	CURSOR_TYPE_WALK
} from "../../../model/game/battle/BattleModel";
import {
	SPECIAL_TYPE_CONVERSATION_EYE,
	SPECIAL_TYPE_CONVERSATION_LOC,
	SPECIAL_TYPE_EXIT,
	SPECIAL_TYPE_SEQUENCE
} from "../../../model/game/battle/battlemap/BattleSpecialModel";
import BattlePartyCharacterModel from "../../../model/game/battle/BattlePartyCharacterModel";
import Pixies from "../../../class/basic/Pixies";

const CURSOR_OFFSET = new Vector2(12, 12);

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
				(m) => new NpcBattleCharacterController(game, m)
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
				this.model.partyCharacters,
				(m) => new BattleCharacterController(game, m)
			)
		);

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.partyCharacters.selectedNode,
				(m) => new SelectedBattleCharacterController(game, m)
			)
		);

		this.addAutoEvent(
			this.model.battleMapId,
			'change',
			() => {
				this.model.battleMap.set(this.game.resources.map.battleMaps.getById(this.model.battleMapId.get()));
			},
			true
		);

		this.addAutoEvent(
			this.saveGame,
			'character-joins-party',
			(character) => {
				let spawnPosition= this.model.groundPosition;

				const npc = this.model.npcCharacters.find((npc) => npc.character.equalsTo(character));
				if (npc) {
					spawnPosition = npc.position;
					this.model.npcCharacters.remove(npc);
				}
				const bc = new BattlePartyCharacterModel();
				bc.characterId.set(character.id.get());
				const battleMap = this.model.battleMap.get();
				const mapBlocks = battleMap.getBlocks();
				let position = spawnPosition;
				while (mapBlocks.some((b) => b.equalsTo(position))) {
					position = spawnPosition.add(new Vector2(Pixies.random(-5, 5), Pixies.random(-5, 5))).round();
				}
				bc.position.set(position);
				this.model.partyCharacters.add(bc);
				this.saveGame.party.selectedCharacterId.set(character.id.get());
			}
		);

		this.addAutoEvent(
			this.model,
			'check-fighting',
			() => {
				this.model.isFighting.set(this.model.npcCharacters.exists((npc) => npc.character.isSet() && npc.character.get().stats.isAggressive.get()));
			},
			true
		);

		this.addAutoEvent(
			this.model,
			'raycast-character',
			(battleCharacter) => {
				this.model.hoveringBattleCharacterRaycast.set(battleCharacter);
			}
		);

		this.addAutoEvent(
			this.model.hoveringBattleCharacter,
			'change',
			() => {
				const battleCharacter = this.model.hoveringBattleCharacter.get();
				const character = battleCharacter ? battleCharacter.character.get() : null;
				this.saveGame.hoveringCharacter.set(character);
			}
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

		this.addAutoEvent(
			this.model.hoveringSpecial,
			'change',
			() => {
				const special = this.model.hoveringSpecial.get();
				if (special && special.type.equalsTo(SPECIAL_TYPE_CONVERSATION_LOC)) {
					const conversation = this.game.resources.conversations.getById(special.data.get());
					if (conversation) {
						this.saveGame.triggerEvent('conversation-hover', conversation);
					}
				} else {
					this.saveGame.triggerEvent('conversation-hover', null);
				}
				if (special && special.type.equalsTo(SPECIAL_TYPE_EXIT)) {
					this.saveGame.triggerEvent('exit-hover', special);
				} else {
					this.saveGame.triggerEvent('exit-hover', null);
				}
			}
		);

		this.addAutoEventMultiple(
			[this.model.isHoveringNoGo, this.model.hoveringSpecial, this.model.hoveringBattleCharacter, this.model.partyCharacters.selectedNode],
			'change',
			() => this.updateCursorType(),
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
						5
					)
				);
			},
			true
		);

		this.addAutoEvent(
			this.game.mainLayerMouseCoordinates,
			'change',
			() => this.onMouseMove()
		);

		this.addAutoEvent(
			this.model.mouseCoordinates,
			'change',
			() => this.onMouseCoordinatesChanged()
		);

		this.addAutoEvent(
			this.model.mouseHoveringTile,
			'change',
			() => this.onHoveringTileChanged()
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
			this.saveGame.party.selectedCharacterId,
			'change',
			() => {
				this.model.partyCharacters.selectedNode.set(this.model.partyCharacters.find((chr) => chr.characterId.equalsTo(this.saveGame.party.selectedCharacterId)));
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

		this.addAutoEventMultiple(
			[this.model.partyCharacters, this.model.npcCharacters],
			'change',
			() => {
				this.model.pathFinder.setBattleCharacters(this.model.partyCharacters.children.items.concat(this.model.npcCharacters.children.items));
			},
			true
		);

		this.addAutoEvent(
			this.model.groundPosition,
			'change',
			() => {
				this.updateGroundItems();
			},
			true
		);

	}

	updateInternal(delta) {
		this.model.pathFinder.resetDynamicBlocksCache();

		// dragging and scrolling
		if (!this.game.controls.mouseDownLeft.get()) {
			this.dragging = false;
		}
		if (!this.game.controls.mouseDownRight.get()) {
			this.scrolling = false;
		}
		this.mouseMoved = false;
	}

	deactivateInternal() {
		this.model.hoveringBattleCharacter.set(null);
	}

	onMouseMove() {
		if (this.mouseMoved) return;
		this.runOnUpdate( () => {
			const corner = this.model.coordinates.subtract(this.game.mainLayerSize.multiply(0.5 / this.model.zoom.get()));
			const coords = corner.add(this.game.mainLayerMouseCoordinates.multiply(1 / this.model.zoom.get()));
			this.model.mouseCoordinates.set(coords.add(CURSOR_OFFSET));
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
		const blocked = this.model.pathFinder.isBlockedStatic(tile);
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
		this.model.zoom.set(Math.max(this.model.zoom.get() + (param * -0.1), 0));
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

		if (occupant && occupant.character.get().conversationId.isSet()) {
			character.triggerEvent('talk-to', occupant);
			return;
		}

		const special = this.model.hoveringSpecial.get();
		if (special) {
			character.triggerEvent('go-to', special.position);
		} else {
			character.triggerEvent('go-to', this.model.mouseHoveringTile);
		}
		if (this.saveGame.party.battleFollowTheLeader.get()) {
			character.triggerEvent('follow-me');
		}
	}

	updateCursorType() {
		this.model.cursorType.set(this.getCursorType());
	}

	getCursorType() {
		if (this.model.partyCharacters.selectedNode.isEmpty()) {
			return CURSOR_TYPE_DEFAULT;
		}
		if (this.model.hoveringBattleCharacter.isSet()) {
			const battleChar = this.model.hoveringBattleCharacter.get();
			const isParty = this.model.partyCharacters.contains(battleChar);
			if (isParty) {
				const isSelected = this.model.partyCharacters.selectedNode.equalsTo(battleChar);
				return isSelected ? CURSOR_TYPE_DEFAULT : CURSOR_TYPE_SWITCH_CHARACTER;
			} else {
				const char = battleChar.character.get();
				if (char.stats.isAggressive.get()) {
					return CURSOR_TYPE_ATTACK;
				}
				if (char.conversationId.isSet()) {
					return CURSOR_TYPE_TALK;
				}
			}
		}
		if (this.model.hoveringSpecial.isSet()) {
			const special = this.model.hoveringSpecial.get();
			if (special.type.equalsTo(SPECIAL_TYPE_EXIT) || special.type.equalsTo(SPECIAL_TYPE_CONVERSATION_LOC)) {
				return CURSOR_TYPE_EXIT;
			}
			if (special.type.equalsTo(SPECIAL_TYPE_SEQUENCE) ||special.type.equalsTo(SPECIAL_TYPE_CONVERSATION_EYE)) {
				return CURSOR_TYPE_EYE;
			}
		}
		return (this.model.isHoveringNoGo.get()) ? CURSOR_TYPE_DEFAULT : CURSOR_TYPE_WALK;
	}

	updateGroundItems() {
		this.model.groundSlots.reset();
		const items = this.model.items.filter((item) => item.position.equalsTo(this.model.groundPosition));
		items.forEach((item) => this.model.groundSlots.addItem(item.item.get()));
	}
}
