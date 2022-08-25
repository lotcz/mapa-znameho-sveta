import DomRenderer from "./basic/DomRenderer";
import MapRenderer from "./map/MapRenderer";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../model/savegame/SaveGameModel";
import BattleRenderer from "./battle/BattleRenderer";
import ConversationRenderer from "./conversation/ConversationRenderer";
import NullableNodeRenderer from "./basic/NullableNodeRenderer";

export default class SaveGameRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	/**
	 * @type {MapRenderer|BattleRenderer}
	 */
	mainRenderer;

	/**
	 * @type NullableNodeRenderer
	 */
	conversationRenderer;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.conversationRenderer = new NullableNodeRenderer(this.game, this.model.conversation, (model) => new ConversationRenderer(this.game, model, this.overlayLayer));
		this.addChild(this.conversationRenderer);

		this.updateLoadingHandler = () => this.updateLoading();
		this.updateGameModeHandler = () => this.updateGameMode();
		this.updateDebugMenuHandler = () => this.updateDebugMenu();
	}

	activateInternal() {
		this.mainLayer = this.addElement('div', ['main', 'container-host']);
		this.overlayLayer = this.addElement('div', ['overlay', 'container-host']);

		this.updateGameMode();
		this.model.mode.addOnChangeListener(this.updateGameModeHandler);

	}

	deactivateInternal() {
		this.model.mode.removeOnChangeListener(this.updateGameModeHandler);
		this.removeElement(this.mainLayer);
		this.removeElement(this.overlayLayer);
	}

	updateGameMode() {
		if (this.mainRenderer) {
			this.removeChild(this.mainRenderer);
		}
		const mode = this.model.mode.get();
		switch (mode) {
			case GAME_MODE_MAP:
				this.mainRenderer = new MapRenderer(this.game, this.model, this.mainLayer);
				break;
			case GAME_MODE_BATTLE:
				this.mainRenderer = new BattleRenderer(this.game, this.model.battle, this.mainLayer);
				break;
			default:
				console.warn(`Unknown game mode ${mode}`);
		}
		if (this.mainRenderer) {
			this.addChild(this.mainRenderer);
		}
	}

}
