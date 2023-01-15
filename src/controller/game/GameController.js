import ControllerNode from "../basic/ControllerNode";
import ControlsController from "./ControlsController";
import * as localForage from "localforage";
import EditorController from "../editor/EditorController";
import SaveGameController from "./SaveGameController";
import NullableNodeController from "../basic/NullableNodeController";
import SaveGameModel from "../../model/game/SaveGameModel";

export default class GameController extends ControllerNode {

	/**
	 * @type GameModel
	 */
	model;

	constructor(model) {
		super(model, model);

		this.model = model;

		this.isResourcesDirty = false;
		this.resourcesTimeOut = null;

		this.addChild(new ControlsController(this.game, this.model.controls));

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.saveGame,
				(m) => new SaveGameController(this.game, m)
			)
		);

		this.addAutoEvent(
			this.model,
			'new-game',
			() => this.runOnUpdate(() => {
					const save = new SaveGameModel();
					const avelard = this.model.resources.characterTemplates.getById(1);
					save.addCharacterToParty(avelard);
					const residence = this.model.resources.map.locations.getById(1);
					save.currentLocationId.set(residence.id.get());
					save.mapCenterCoordinates.set(residence.coordinates);
					save.currentBattleMapId.set(residence.battleMapId.get())
					const sequence = this.model.resources.sequences.getById(1);
					save.animationSequence.set(sequence);
					this.model.saveGame.set(save);
				}
			)
		);

		this.addAutoEvent(
			window,
			'resize',
			() => {
				this.runOnUpdate(() => this.model.viewBoxSize.set(window.innerWidth, window.innerHeight));
			},
			true
		);

		this.addAutoEvent(
			this.model.controls,
			'debug-key',
			() => {
				this.model.isInDebugMode.invert();
			}
		);

		this.addAutoEvent(
			this.model.isInDebugMode,
			'change',
			() => {
				this.updateDebugMenu();
			},
			true
		);

		this.addAutoEvent(
			this.model,
			'save-ui',
			() => {
				this.saveGameToStorage().then(() => {
					console.log('savegame saved');
				});
				this.saveResourcesToStorage().then(() => {
					console.log('resources saved');
				});
			}
		);

	}

	activateInternal() {
		this.loadResourcesFromStorage().then(() => {
			this.model.resources.addOnDirtyListener(() => this.isResourcesDirty = true);
			console.log('resources loaded');
			this.loadGameFromStorage().then(() => {
				console.log('savegame loaded');
			});
		});
	}

	updateInternal(delta) {
		this.resourcesTimeOut = (this.resourcesTimeOut === null) ? 3000 : this.resourcesTimeOut - delta;
		if (this.isResourcesDirty && this.resourcesTimeOut <= 0) {
			this.resourcesTimeOut = null;
			this.isResourcesDirty = false;
			this.saveResourcesToStorage().then(() => {
				this.resourcesTimeOut = null;
				console.log('resources saved');
			});
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
				console.log('no saved ui in storage');
			}
		} catch (err) {
			console.error('Error when loading ui.', err);
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
