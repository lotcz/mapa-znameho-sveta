import ControllerNode from "./basic/ControllerNode";
import ControlsController from "./ControlsController";
import MapController from "./map/MapController";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../model/savegame/SaveGameModel";
import BattleController from "./battle/BattleController";
import * as localForage from "localforage";
import EditorController from "./EditorController";
import ConversationController from "./ConversationController";
import SaveGameController from "./SaveGameController";
import NullableNodeController from "./basic/NullableNodeController";

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

	}

	activateInternal() {
		this.onResize();
		window.addEventListener('resize', this.onResizeHandler);

		this.model.controls.addOnDebugKeyListener(this.onDebugKeyHandler);

		this.updateDebugMenu();
		this.model.isInDebugMode.addOnChangeListener(this.updateDebugMenuHandler);

		this.loadResourcesFromStorage().then(() => {
			this.model.resources.addOnDirtyListener(() => this.isResourcesDirty = true);
		});
	}

	deactivateInternal() {
		window.removeEventListener('resize', this.onResizeHandler);
		this.model.controls.removeOnDebugKeyListener(this.onDebugKeyHandler);
		this.model.isInDebugMode.removeOnChangeListener(this.updateDebugMenuHandler);
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
