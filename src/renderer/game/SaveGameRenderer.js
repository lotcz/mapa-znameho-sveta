import DomRenderer from "../basic/DomRenderer";
import MapRenderer from "./map/MapRenderer";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/game/SaveGameModel";
import BattleRenderer from "./battle/BattleRenderer";
import ConversationRenderer from "./conversation/ConversationRenderer";
import NullableNodeRenderer from "../basic/NullableNodeRenderer";
import PartyRenderer from "./party/PartyRenderer";
import SelectedSlotRenderer from "./party/SelectedSlotRenderer";
import Pixies from "../../class/basic/Pixies";
import Vector2 from "../../model/basic/Vector2";

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

	/**
	 * @type PartyRenderer
	 */
	partyRenderer;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;
		this.mainLayer = null;
		this.topLayer = null;

		this.conversationRenderer = new NullableNodeRenderer(this.game, this.model.conversation, (m) => new ConversationRenderer(this.game, m, this.topLayer));
		this.addChild(this.conversationRenderer);

		this.selectedItemRenderer = new NullableNodeRenderer(this.game, this.model.selectedInventorySlot, (m) => new SelectedSlotRenderer(this.game, m, this.dom));
		this.addChild(this.selectedItemRenderer);

		this.addAutoEvent(
			window,
			'resize',
			() => this.mainLayerResized(),
			true
		);

		this.addAutoEvent(
			this.model.party,
			'inventory-resize',
			() => this.mainLayerResized()
		);

		this.updateLoadingHandler = () => this.updateLoading();
		this.updateGameModeHandler = () => this.updateGameMode();
		this.updateDebugMenuHandler = () => this.updateDebugMenu();
	}

	activateInternal() {
		this.container = this.addElement('div', 'savegame-container container container-host');
		const bottomLayer = Pixies.createElement(this.container, 'div', 'bottom-layer container container-host row stretch');
		this.topLayer = Pixies.createElement(this.container, 'div', 'top-layer ');

		const party = Pixies.createElement(bottomLayer, 'div', 'savegame-party row stretch');
		this.mainLayer = Pixies.createElement(bottomLayer, 'div', 'main row stretch');
		this.mainLayer.addEventListener(
			'mousemove',
			(e) => {
				const bcr = this.mainLayer.getBoundingClientRect();
				const position = new Vector2(e.pageX - bcr.left, e.pageY - bcr.top);
				this.model.triggerEvent('mousemove', position);
			}
		);

		if (this.partyRenderer) {
			this.removeChild(this.partyRenderer);
		}
		this.partyRenderer = new PartyRenderer(this.game, this.model.party, party, this.topLayer);
		this.addChild(this.partyRenderer);

		this.updateGameMode();
		this.model.mode.addOnChangeListener(this.updateGameModeHandler);
	}

	deactivateInternal() {
		this.model.mode.removeOnChangeListener(this.updateGameModeHandler);
		this.removeElement(this.container);
		this.container = null;
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
				if (this.model.currentBattle.isEmpty()) {
					console.log('no battle to fight!');
					return;
				}
				this.mainRenderer = new BattleRenderer(this.game, this.model.currentBattle.get(), this.mainLayer);
				break;
			default:
				console.warn(`Unknown game mode ${mode}`);
		}
		if (this.mainRenderer) {
			this.addChild(this.mainRenderer);
		}
	}

	mainLayerResized() {
		const size = new Vector2(this.mainLayer.offsetWidth, this.mainLayer.offsetHeight);
		this.model.triggerEvent('resize', size);
	}

}
