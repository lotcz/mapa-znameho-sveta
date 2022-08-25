import ControllerNode from "./basic/ControllerNode";
import ControlsController from "./ControlsController";
import MapController from "./MapController";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../model/savegame/SaveGameModel";
import BattleController from "./BattleController";
import * as localForage from "localforage";
import EditorController from "./EditorController";
import ConversationController from "./ConversationController";

export default class GameController extends ControllerNode {

	/**
	 * @type GameModel
	 */
	model;

	/**
	 * @type ControlsController
	 */
	controlsController;

	mainController;

	/**
	 * @type EditorController
	 */
	editorController;

	/**
	 * @type ConversationController
	 */
	conversationController;

	constructor(model) {
		super(model, model);

		this.model = model;

		this.isResourcesDirty = false;
		this.resourcesTimeOut = null;
		this.controlsController = new ControlsController(this.game, this.model.controls);
		this.addChild(this.controlsController);
		this.conversationController = null;

		this.onResizeHandler = () => this.onResize();
		this.onDebugKeyHandler = () => this.onDebugKey();
		this.updateDebugMenuHandler = () => this.updateDebugMenu();
		this.conversationChangedHandler = () => this.updateConversation();
		this.onGameModeChanged = () => this.updateGameMode();

		this.updateDebugMenu();
		this.updateGameMode();
	}

	activateInternal() {
		this.onResize();
		window.addEventListener('resize', this.onResizeHandler);
		this.model.controls.addOnDebugKeyListener(this.onDebugKeyHandler);
		this.model.isInDebugMode.addOnChangeListener(this.updateDebugMenuHandler);

		this.updateConversation();
		this.model.saveGame.conversation.addOnChangeListener(this.conversationChangedHandler);

		this.loadResourcesFromStorage().then(() => {
			this.model.resources.addOnDirtyListener(() => this.isResourcesDirty = true);
			this.model.saveGame.mode.addOnChangeListener(this.onGameModeChanged);
		});
	}

	deactivateInternal() {
		window.removeEventListener('resize', this.onResizeHandler);
		this.model.controls.removeOnDebugKeyListener(this.onDebugKeyHandler);
		this.model.isInDebugMode.removeOnChangeListener(this.updateDebugMenuHandler);
		this.model.saveGame.conversation.removeOnChangeListener(this.conversationChangedHandler);
		this.model.saveGame.mode.removeOnChangeListener(this.onGameModeChanged);
	}

	updateInternal(delta) {
		super.updateInternal(delta);
		if (this.resourcesTimeOut !== null) this.resourcesTimeOut -= delta;
		if (this.isResourcesDirty) {
			if (this.resourcesTimeOut === null) this.resourcesTimeOut = 1000;
			if (this.resourcesTimeOut <= 0) {
				this.saveResourcesToStorage().then(() => {
					this.isResourcesDirty = false;
					this.resourcesTimeOut = null;
					console.log('resources saved');
				});
			}
		}
	}

	updateConversation() {
		if (this.conversationController) {
			this.removeChild(this.conversationController);
			this.conversationController = null;
			if (this.mainController) this.mainController.activate();
		}
		if (this.model.saveGame.conversation.isSet()) {
			this.conversationController = new ConversationController(this.game, this.model.saveGame.conversation.get());
			this.addChild(this.conversationController);
			if (this.mainController) this.mainController.deactivate();
		}
	}

	updateDebugMenu() {
		if (this.editorController) {
			this.removeChild(this.editorController);
			this.editorController = null;
		}
		if (this.model.isInDebugMode.get()) {
			this.editorController = new EditorController(this.game, this.model.editor);
			this.addChild(this.editorController);
		}
	}

	updateGameMode() {
		const mode = this.model.saveGame.mode.get();
		if (this.mainController) this.removeChild(this.mainController);

		switch (mode) {
			case GAME_MODE_MAP:
				this.mainController = this.addChild(new MapController(this.game, this.model.saveGame));
				break;
			case GAME_MODE_BATTLE:
				this.mainController = this.addChild(new BattleController(this.game, this.model.saveGame.battle));
				break;
		}
	}

	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
		this.model.characterPreview.size.set(this.model.viewBoxSize);
	}

	onDebugKey() {
		this.model.isInDebugMode.set(!this.model.isInDebugMode.get());
	}

	async loadResourcesFromStorage() {
		try {
			const state = await localForage.getItem('kobok-resources');
			if (state) {
				this.model.resources.restoreState(state);
			} else {
				console.log('nothing in storage');
			}
		} catch (err) {
			console.error(err);
		}
	}

	async saveResourcesToStorage() {
		const state = this.model.resources.getState();
		try {
			await localForage.setItem('kobok-resources', state);
		} catch (err) {
			console.error(err);
		}
	}

}
