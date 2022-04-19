import DomRenderer from "./DomRenderer";
import Pixies from "../class/Pixies";
import MapRenderer from "./MapRenderer";
import ThreeRenderer from "./ThreeRenderer";
import {GAME_MODE_BATTLE, GAME_MODE_MAP, GAME_MODE_THREE} from "../model/SaveGameModel";
import BattleRenderer from "./BattleRenderer";

export default class GameRenderer extends DomRenderer {

	/**
	 * @type GameModel
	 */
	model;

	/**
	 * @type {MapRenderer|ThreeRenderer}
	 */
	mainRenderer;

	constructor(model, dom) {
		super(model, model, dom);

		this.model = model;
		this.alwaysRender = true;
		this.loading = null;
		this.debugMenu = null;
		this.addClass('game');

		this.updateLoadingHandler = () => this.updateLoading();
		this.updateGameModeHandler = () => this.updateGameMode();
		this.updateDebugMenuHandler = () => this.updateDebugMenu();
	}

	activateInternal() {
		const initLoading = document.getElementById('initial_loading');
		if (initLoading) Pixies.destroyElement(initLoading);

		this.mainLayer = this.addElement('div', 'main');

		this.updateLoading();
		this.model.assets.isLoading.addOnChangeListener(this.updateLoadingHandler);

		this.updateGameMode();
		this.model.saveGame.mode.addOnChangeListener(this.updateGameModeHandler);

		this.updateDebugMenu();
		this.model.isInDebugMode.addOnChangeListener(this.updateDebugMenuHandler);
	}

	deactivateInternal() {
		this.model.assets.isLoading.removeOnChangeListener(this.updateLoadingHandler);
		this.model.saveGame.mode.removeOnChangeListener(this.updateGameModeHandler);
		this.model.isInDebugMode.removeOnChangeListener(this.updateDebugMenuHandler);
		this.removeElement(this.mainLayer);
	}

	updateGameMode() {
		if (this.mainRenderer) {
			this.removeChild(this.mainRenderer);
		}
		const mode = this.model.saveGame.mode.get();
		switch (mode) {
			case GAME_MODE_MAP:
				this.mainRenderer = this.addChild(new MapRenderer(this.game, this.model.saveGame, this.mainLayer));
				break;
			case GAME_MODE_THREE:
				this.mainRenderer = this.addChild(new ThreeRenderer(this.game, this.model.characterPreview, this.mainLayer));
				break;
			case GAME_MODE_BATTLE:
				this.mainRenderer = this.addChild(new BattleRenderer(this.game, this.model.battle, this.mainLayer));
				break;
			default:
				console.warn(`Unknown game mode ${mode}`);
		}
	}

	updateLoading() {
		if (this.model.assets.isLoading.get()) {
			this.showLoading();
		} else {
			this.hideLoading();
		}
	}

	showLoading() {
		if (!this.loading) {
			this.loading = this.addElement('div', 'loading');
			const inner = Pixies.createElement(this.loading, 'div');
			inner.innerText = 'Obětujte ovci...';
		}
	}

	hideLoading() {
		if (this.loading) {
			this.removeElement(this.loading);
			this.loading = null;
		}
	}

	updateDebugMenu() {
		if (this.model.isInDebugMode.get()) {
			this.showDebugMenu();
		} else {
			this.hideDebugMenu();
		}
	}

	showDebugMenu() {
		if (!this.debugMenu) {
			this.debugMenu = this.addElement('div', 'debug-menu');
			const mapButton = Pixies.createElement(this.debugMenu, 'button');
			mapButton.innerText = 'MAP';
			mapButton.addEventListener('click', () => this.model.saveGame.mode.set(GAME_MODE_MAP));
			const characterButton = Pixies.createElement(this.debugMenu, 'button');
			characterButton.innerText = 'THREE';
			characterButton.addEventListener('click', () => this.model.saveGame.mode.set(GAME_MODE_THREE));
			const battleButton = Pixies.createElement(this.debugMenu, 'button');
			battleButton.innerText = 'BATTLE';
			battleButton.addEventListener('click', () => this.model.saveGame.mode.set(GAME_MODE_BATTLE));
		}
	}

	hideDebugMenu() {
		if (this.debugMenu) {
			this.removeElement(this.debugMenu);
			this.debugMenu = null;
		}
	}

}
