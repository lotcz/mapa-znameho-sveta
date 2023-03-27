import ControllerNode from "../basic/ControllerNode";
import ControlsController from "./ControlsController";
import * as localForage from "localforage";
import EditorController from "../editor/EditorController";
import SaveGameController from "./SaveGameController";
import NullableNodeController from "../basic/NullableNodeController";
import SaveGameModel from "../../model/game/SaveGameModel";
import ConditionalNodeController from "../basic/ConditionalNodeController";
import {TIME_MORNING} from "../../model/game/environment/TimeModel";
import MenuModel from "../../model/menu/MenuModel";

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

		this.addChild(
			new ConditionalNodeController(
				this.game,
				this.game.isInDebugMode,
				() => this.game.isInDebugMode.get(),
				() => new EditorController(this.game, this.model.editor)
			)
		);

		this.addAutoEvent(
			this.model,
			'new-game',
			() => this.runOnUpdate(() => this.startNewGame())
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
			this.showMainMenu();
			/*
			this.loadGameFromStorage().then(() => {
				console.log('savegame loaded');
			});
			 */
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
				const saveGame = new SaveGameModel();
				saveGame.restoreState(state);
				this.model.saveGame.set(saveGame);
				this.model.menu.set(null);
			} else {
				console.log('no saved game in storage');
			}
		} catch (err) {
			console.error('Error when loading saved game.', err);
		}
	}

	async saveGameToStorage() {
		const saveGame = this.model.saveGame.get();
		if (!saveGame) return;
		const state = saveGame.getState();
		try {
			await localForage.setItem('kobok-autosave', state);
		} catch (err) {
			console.error(err);
		}
	}

	startNewGame() {
		const save = new SaveGameModel();
		save.time.timeOfDay.set(TIME_MORNING);
		const avelard = this.model.resources.characterTemplates.getById(1);
		save.addCharacterToParty(avelard);
		const residence = this.model.resources.map.locations.getById(1);
		save.currentLocationId.set(residence.id.get());
		save.mapCenterCoordinates.set(residence.coordinates);
		save.currentBattleMapId.set(residence.battleMapId.get());
		const sequence = this.model.resources.sequences.getById(1);
		save.animationSequence.set(sequence);
		this.model.saveGame.set(save);
		this.model.menu.set(null);
	}

	showMainMenu() {
		const options = [
			{text: 'Začít novou hru', onClick: () => this.startNewGame()},
			{text: 'Obnovit uloženou pozici', onClick: () => this.loadGameFromStorage()},
			{text: 'Nastavení', onClick: () => this.loadGameFromStorage()}
		];
		if (this.model.saveGame.isSet()) {
			options.push({text: 'Pokračovat', onClick: () => this.startNewGame()});
		}
		const menu = MenuModel.createMenu('Menu', options);
		this.model.menu.set(menu);
	}

}
