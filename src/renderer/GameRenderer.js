import DomRenderer from "./DomRenderer";
import Pixies from "../class/Pixies";
import MapRenderer from "./MapRenderer";
import ThreeRenderer from "./ThreeRenderer";
import {GAME_MODE_MAP, GAME_MODE_THREE} from "../model/SaveGameModel";

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
		this.loading = null;
		this.debugMenu = null;
		this.addClass('game');

		this.mainLayer = this.addElement('div', 'main');

		//this.threeLayer = this.addElement('div', 'three');
		//this.threeRenderer = this.addChild(new ThreeRenderer(this.game, this.model.three, this.threeLayer));

		Pixies.destroyElement(document.getElementById('initial_loading'));

		this.model.assets.isLoading.addOnChangeListener(() => {
			if (this.model.assets.isLoading.get()) {
				this.showLoading();
			} else {
				this.hideLoading();
			}
		});

		if (this.model.assets.isLoading.get()) {
			this.showLoading();
		}

		this.model.isInDebugMode.addOnChangeListener(() => {
			if (this.model.isInDebugMode.get()) {
				this.showDebugMenu();
			} else {
				this.hideDebugMenu();
			}
		});

		if (this.model.isInDebugMode.get()) {
			this.showDebugMenu();
		}

		this.model.saveGame.mode.addOnChangeListener(() => {
			this.updateGameMode();
		});

		this.updateGameMode();
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

	showDebugMenu() {
		if (!this.debugMenu) {
			this.debugMenu = this.addElement('div', 'debug-menu');
			const mapButton = Pixies.createElement(this.debugMenu, 'button');
			mapButton.innerText = 'MAP';
			mapButton.addEventListener('click', () => this.model.saveGame.mode.set(GAME_MODE_MAP));
			const characterButton = Pixies.createElement(this.debugMenu, 'button');
			characterButton.innerText = 'THREE';
			characterButton.addEventListener('click', () => this.model.saveGame.mode.set(GAME_MODE_THREE));
		}
	}

	hideDebugMenu() {
		if (this.debugMenu) {
			this.removeElement(this.debugMenu);
			this.debugMenu = null;
		}
	}

}
