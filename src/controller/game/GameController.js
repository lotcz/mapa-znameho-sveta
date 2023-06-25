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
import MenuItemModel from "../../model/menu/MenuItemModel";

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
			this.model,
			'show-main-menu',
			() => this.showMainMenu()
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
		});
	}

	updateInternal(delta) {
		if (this.game.isInDebugMode.get()) {
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
		let avelard = this.model.resources.characterTemplates.getById(1);
		avelard = save.addCharacterToParty(avelard);
		save.party.selectedCharacterId.set(avelard.id.get());
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
		const menu = new MenuModel('Menu');
		menu.items.add(new MenuItemModel('Začít novou hru', () => this.startNewGame()));
		menu.items.add(new MenuItemModel('Obnovit uloženou pozici', () => this.loadGameFromStorage()));

		if (this.model.saveGame.isSet()) {
			menu.items.add(new MenuItemModel('Uložit hru', () => this.saveGameToStorage().then(() => this.hideMenu())));
			menu.items.add(new MenuItemModel('Pokračovat', () => this.hideMenu()));
		}

		this.model.menu.set(menu);
	}

	hideMenu() {
		this.model.menu.set(null);
	}

}
