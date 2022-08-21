import DomRenderer from "./basic/DomRenderer";
import Pixies from "../class/basic/Pixies";
import MapRenderer from "./MapRenderer";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../model/savegame/SaveGameModel";
import BattleRenderer from "./BattleRenderer";
import EditorRenderer from "./editor/EditorRenderer";
import ConversationRenderer from "./conversation/ConversationRenderer";

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

		this.editorRenderer = null;
		this.conversationRenderer= null;

		this.updateLoadingHandler = () => this.updateLoading();
		this.updateGameModeHandler = () => this.updateGameMode();
		this.updateDebugMenuHandler = () => this.updateDebugMenu();
		this.updateConversationHandler = () => this.updateConversation();
	}

	activateInternal() {
		const initLoading = document.getElementById('initial_loading');
		if (initLoading) Pixies.destroyElement(initLoading);

		this.mainLayer = this.addElement('div', ['main', 'container-host']);
		this.overlayLayer = this.addElement('div', ['overlay', 'container-host']);

		this.updateLoading();
		this.model.assets.isLoading.addOnChangeListener(this.updateLoadingHandler);

		this.updateGameMode();
		this.model.saveGame.mode.addOnChangeListener(this.updateGameModeHandler);

		this.updateConversation();
		this.model.saveGame.runningConversation.addOnChangeListener(this.updateConversationHandler);

		this.updateDebugMenu();
		this.model.isInDebugMode.addOnChangeListener(this.updateDebugMenuHandler);
	}

	deactivateInternal() {
		this.model.assets.isLoading.removeOnChangeListener(this.updateLoadingHandler);
		this.model.saveGame.mode.removeOnChangeListener(this.updateGameModeHandler);
		this.model.saveGame.runningConversation.removeOnChangeListener(this.updateConversationHandler);
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
			case GAME_MODE_BATTLE:
				this.mainRenderer = this.addChild(new BattleRenderer(this.game, this.model.saveGame.battle, this.mainLayer));
				break;
			default:
				console.warn(`Unknown game mode ${mode}`);
		}
	}

	updateConversation() {
		if (this.conversationRenderer) {
			this.removeChild(this.conversationRenderer);
		}
		if (this.model.saveGame.runningConversation.isSet()) {
			this.conversationRenderer = this.addChild(new ConversationRenderer(this.game, this.model.saveGame.runningConversation.get(), this.overlayLayer));
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
		if (!this.editorRenderer) {
			this.editorRenderer = new EditorRenderer(this.game, this.model.editor, this.dom);
			this.addChild(this.editorRenderer);
		}
	}

	hideDebugMenu() {
		if (this.editorRenderer) {
			this.removeChild(this.editorRenderer);
			this.editorRenderer = null;
		}
	}

}
