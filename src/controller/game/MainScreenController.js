import ControllerNode from "../basic/ControllerNode";
import MapController from "./map/MapController";
import BattleController from "./battle/BattleController";
import ConversationController from "./conversation/ConversationController";
import PartyController from "./party/PartyController";
import NullableNodeController from "../basic/NullableNodeController";
import {TIME_HOUR} from "../../model/game/environment/TimeModel";
import {STAT_TEMPERATURE} from "../../model/game/party/stats/StatDefinitionModel";

const REST_SPEED = 2 * TIME_HOUR; // portion of day per second

export default class MainScreenController extends ControllerNode {

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

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.currentBattle,
				(m) => new BattleController(this.game, m, this.model),
				() => new MapController(this.game, this.model)
			)
		);

		this.addAutoEvent(
			this.model.conversation,
			'change',
			() => this.updateConversation(),
			true
		);

		this.addAutoEvent(
			this.model,
			'trigger-resize',
			() => {
				this.runOnUpdate(() => this.model.triggerEvent('resize'));
			}
		);

		this.addAutoEvent(
			this.model,
			'resized',
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
				if (this.model.selectedItemSlot.item.isSet()) {
					this.model.triggerEvent('drop-selected-item');
				}
			}
		);

		this.addAutoEvent(
			this.game.controls,
			'esc-key',
			() => {
				this.game.triggerEvent('show-main-menu');
			}
		);

		this.addAutoEventMultiple(
			[this.model.currentLocation, this.model.currentPath],
			'change',
			() => {
				if (this.model.currentLocation.isSet()) {
					this.model.currentBiotopeId.set(this.model.currentLocation.get().biotopeId.get());
				} else if (this.model.currentPath.isSet()) {
					this.model.currentBiotopeId.set(this.model.currentPath.get().biotopeId.get());
				}
			},
			true
		);

		this.addAutoEvent(
			this.model.currentBiotopeId,
			'change',
			() => {
				this.model.currentBiotope.set(this.game.resources.map.biotopes.getById(this.model.currentBiotopeId.get()));
			},
			true
		);

		this.addAutoEvent(
			this.model.currentBiotope,
			'change',
			() => this.updateBiotope()
		);

	}

	afterActivatedInternal() {
		this.updateBiotope();
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
			this.model.time.passTime(diff);
			this.model.partyResting.set(resting);
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

	updateBiotope() {
		// update environment effects on party
		this.model.party.forEachCharacter((ch) => {
			ch.stats.environmentStatEffects.reset();
		});

		if (this.model.currentBiotope.isEmpty()) {
			return;
		}

		const biotope = this.model.currentBiotope.get();

		const temperatureEffect = biotope.statEffects.find((se) => se.statId.equalsTo(STAT_TEMPERATURE));
		const effectAmount = temperatureEffect ? temperatureEffect.amount.get() : 0;
		this.model.temperature.value.set(10 + effectAmount);

		this.model.party.forEachCharacter((ch) => {
			biotope.statEffects.forEach((eff) => {
				ch.stats.environmentStatEffects.add(eff)
			});
		});
	}

}
