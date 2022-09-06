import ControllerNode from "../basic/ControllerNode";
import ControlsController from "./ControlsController";
import MapController from "../savegame/map/MapController";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/savegame/SaveGameModel";
import BattleController from "../savegame/battle/BattleController";
import * as localForage from "localforage";
import EditorController from "../editor/EditorController";
import ConversationController from "../savegame/conversation/ConversationController";
import SaveGameController from "../savegame/SaveGameController";
import NullableNodeController from "../basic/NullableNodeController";

export default class GameController extends ControllerNode {

	/**
	 * @type GameModel
	 */
	model;

	/**
	 * @type ControlsController
	 */
	controlsController;

	/**
	 * @type NullableNodeController
	 */
	saveGameController;

	constructor(model) {
		super(model, model);

		this.model = model;

		this.isResourcesDirty = false;
		this.resourcesTimeOut = null;

		this.controlsController = new ControlsController(this.game, this.model.controls);
		this.addChild(this.controlsController);

		this.saveGameController = new NullableNodeController(this.game, this.model.saveGame, (model) => new SaveGameController(this.game, model));
		this.addChild(this.saveGameController);

		this.onResizeHandler = () => this.onResize();
		this.onDebugKeyHandler = () => this.onDebugKey();
		this.updateDebugMenuHandler = () => this.updateDebugMenu();
		this.onSaveGameHandler = () => 	{
			this.saveGameToStorage().then(() => {
				console.log('game saved');
			});
		}
	}

	activateInternal() {
		this.onResize();
		window.addEventListener('resize', this.onResizeHandler);

		this.model.controls.addOnDebugKeyListener(this.onDebugKeyHandler);

		this.updateDebugMenu();
		this.model.isInDebugMode.addOnChangeListener(this.updateDebugMenuHandler);

		this.model.saveGame.addEventListener('save', this.onSaveGameHandler);

		this.loadResourcesFromStorage().then(() => {
			this.model.resources.addOnDirtyListener(() => this.isResourcesDirty = true);
			console.log('resources loaded');
			this.loadGameFromStorage().then(() => {
				console.log('game loaded');
			});
		});

	}

	deactivateInternal() {
		window.removeEventListener('resize', this.onResizeHandler);
		this.model.controls.removeOnDebugKeyListener(this.onDebugKeyHandler);
		this.model.isInDebugMode.removeOnChangeListener(this.updateDebugMenuHandler);
		this.model.saveGame.removeEventListener('save', this.onSaveGameHandler);
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

	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
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

	async loadGameFromStorage() {
		try {
			const state = await localForage.getItem('kobok-autosave');
			if (state) {
				this.model.saveGame.restoreState(state);
			} else {
				console.log('no saved game in storage');
			}
		} catch (err) {
			console.error('Error when loading game.', err);
		}
	}

	async saveGameToStorage() {
		const state = this.model.saveGame.getState();
		try {
			await localForage.setItem('kobok-autosave', state);
		} catch (err) {
			console.error(err);
		}
	}

}
