import ControllerNode from "../basic/ControllerNode";
import MapController from "./map/MapController";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/game/SaveGameModel";
import BattleController from "./battle/BattleController";
import ConversationController from "./conversation/ConversationController";
import PartyController from "./party/PartyController";
import BattleItemModel from "../../model/game/battle/BattleItemModel";

const REST_SPEED = 0.15; // portion of day per second

export default class SaveGameController extends ControllerNode {

	/**
	 * @type SaveGameModel
	 */
	model;

	mainController;

	/**
	 * @type ConversationController
	 */
	conversationController;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.isResourcesDirty = false;
		this.resourcesTimeOut = null;

		this.conversationController = null;
		this.mainController = null;

		this.partyController = new PartyController(this.game, this.model.party);
		this.addChild(this.partyController);

		this.conversationChangedHandler = () => this.updateConversation();
		this.onGameModeChanged = () => this.updateGameMode();

		this.addAutoEvent(
			this.model,
			'item-slot-selected',
			(slot) => {
				if (this.model.selectedInventorySlot.equalsTo(slot)) {
					this.model.selectedInventorySlot.set(null);
					return;
				}

				if (this.model.selectedInventorySlot.isSet()) {
					const oldItem = this.model.selectedInventorySlot.get().item.get();

					if (slot.name === 'drop') {
						if (oldItem && this.model.mode.equalsTo(GAME_MODE_BATTLE)) {
							const battleItem = new BattleItemModel();
							battleItem.item.set(oldItem);
							const character = this.model.party.selectedCharacter.get();
							const battle = this.model.currentBattle.get();
							const battleCharacter = battle.partyCharacters.find((chr) => chr.characterId.equalsTo(character.id));
							battleItem.position.set(battleCharacter.position);
							battle.items.add(battleItem);
						}

						this.model.selectedInventorySlot.get().item.set(null);
						this.model.selectedInventorySlot.set(null);
						return;
					}

					const def = this.game.resources.itemDefinitions.getById(oldItem.definitionId.get());
					if (!slot.accepts(def.type.get())) {
						return;
					}
					if (slot.item.isSet()) {
						const newItem = slot.item.get();
						slot.item.set(oldItem);
						this.model.selectedInventorySlot.get().item.set(newItem);
						return;
					}
					slot.item.set(oldItem)
					this.model.selectedInventorySlot.get().item.set(null);
					this.model.selectedInventorySlot.set(null);
					return;
				}
				if (slot.item.isSet()) {
					this.model.selectedInventorySlot.set(slot);
				}
			}
		);

		this.addAutoEvent(
			this.model,
			'main-layer-resized',
			(size) => {
				this.runOnUpdate(() => this.game.mainLayerSize.set(size));
			}
		);

		this.addAutoEvent(
			this.model,
			'mousemove',
			(position) => {
				this.runOnUpdate(() => this.game.mainLayerMouseCoordinates.set(position));
			}
		);

		this.addAutoEvent(
			this.game.controls,
			'right-click',
			() => {
				// drop item or deselect party character
				if (this.model.selectedInventorySlot.isSet()) {
					this.model.selectedInventorySlot.set(null);
					return;
				}
				//this.model.party.isInventoryVisible.set(false);
			}
		)
	}

	activateInternal() {
		this.updateConversation();
		this.model.conversation.addOnChangeListener(this.conversationChangedHandler);

		this.updateGameMode();
		this.model.mode.addOnChangeListener(this.onGameModeChanged);
	}

	deactivateInternal() {
		this.model.conversation.removeOnChangeListener(this.conversationChangedHandler);
		this.model.mode.removeOnChangeListener(this.onGameModeChanged);
	}

	updateInternal(delta) {
		// rest
		let resting = this.model.partyResting.get();
		if (resting > 0) {
			let diff = (delta / 1000) * REST_SPEED;
			if (diff > resting) {
				diff = resting;
			}
			resting -= diff;
			this.model.passTime(diff);
			this.model.partyResting.set(resting);
		} else {
			this.model.partyResting.set(0);
		}
	}

	updateConversation() {
		if (this.conversationController) {
			this.removeChild(this.conversationController);
			this.conversationController = null;
			if (this.mainController) this.mainController.activate();
		}
		if (this.model.conversation.isSet()) {
			this.conversationController = new ConversationController(this.game, this.model.conversation.get());
			this.addChild(this.conversationController);
			if (this.mainController) this.mainController.deactivate();
		}
	}

	updateGameMode() {
		const mode = this.model.mode.get();
		if (this.mainController) this.removeChild(this.mainController);

		switch (mode) {
			case GAME_MODE_MAP:
				this.mainController = this.addChild(new MapController(this.game, this.model));
				break;
			case GAME_MODE_BATTLE:
				if (this.model.currentBattle.isEmpty()) {
					this.model.mode.set(GAME_MODE_MAP);
					console.log('no battle to fight!');
					return;
				}
				this.mainController = this.addChild(new BattleController(this.game, this.model.currentBattle.get()));
				break;
		}
	}

}
