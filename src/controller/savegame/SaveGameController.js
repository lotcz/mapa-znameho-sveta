import ControllerNode from "../basic/ControllerNode";
import ControlsController from "../game/ControlsController";
import MapController from "./map/MapController";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/savegame/SaveGameModel";
import BattleController from "./battle/BattleController";
import * as localForage from "localforage";
import EditorController from "../editor/EditorController";
import ConversationController from "./conversation/ConversationController";
import PartyController from "./party/PartyController";

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
				this.mainController = this.addChild(new BattleController(this.game, this.model.battle.get()));
				break;
		}
	}

}
