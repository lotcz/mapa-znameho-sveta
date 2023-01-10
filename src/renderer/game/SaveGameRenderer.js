import DomRenderer from "../basic/DomRenderer";
import MapRenderer from "./map/MapRenderer";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/game/SaveGameModel";
import BattleRenderer from "./battle/BattleRenderer";
import ConversationRenderer from "./conversation/ConversationRenderer";
import NullableNodeRenderer from "../basic/NullableNodeRenderer";
import PartyRenderer from "./party/PartyRenderer";
import SelectedSlotRenderer from "./party/inventory/SelectedSlotRenderer";
import Pixies from "../../class/basic/Pixies";
import Vector2 from "../../model/basic/Vector2";
import SequenceRenderer from "./sequence/SequenceRenderer";

export default class SaveGameRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	/**
	 * @type {MapRenderer|BattleRenderer}
	 */
	mainRenderer;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;
		this.mainLayer = null;
		this.topLayer = null;

		this.addAutoEvent(
			window,
			'resize',
			() => this.mainLayerResized(),
			true
		);

		this.addAutoEvent(
			this.model.party.isInventoryVisible,
			'change',
			() => this.mainLayerResized()
		);

		this.addAutoEvent(
			this.model,
			'trigger-resize',
			() => this.mainLayerResized()
		);

		this.addAutoEvent(
			this.model.mode,
			'change',
			() => this.updateGameMode(),
			true
		);

	}

	activateInternal() {
		this.container = this.addElement('div', 'savegame-container container container-host');
		const bottomLayer = Pixies.createElement(this.container, 'div', 'bottom-layer container container-host row stretch');
		this.topLayer = Pixies.createElement(this.container, 'div', 'top-layer ');

		this.partyPanel = Pixies.createElement(bottomLayer, 'div', 'savegame-party row stretch');
		this.mainLayer = Pixies.createElement(bottomLayer, 'div', 'main row stretch flex-1');
		this.mainLayer.addEventListener(
			'mousemove',
			(e) => {
				const bcr = this.mainLayer.getBoundingClientRect();
				const position = new Vector2(e.pageX - bcr.left, e.pageY - bcr.top);
				this.model.triggerEvent('mousemove', position);
			}
		);

		this.rightPanel = Pixies.createElement(bottomLayer, 'div', 'right-panel row stretch');

		this.addChild(new NullableNodeRenderer(this.game, this.model.conversation, (m) => new ConversationRenderer(this.game, m, this.topLayer)));
		this.addChild(new NullableNodeRenderer(this.game, this.model.selectedInventorySlot, (m) => new SelectedSlotRenderer(this.game, m, this.container)));
		this.addChild(new PartyRenderer(this.game, this.model.party, this.partyPanel, this.topLayer));

		this.addChild(new NullableNodeRenderer(this.game, this.model.animationSequence, (m) => new SequenceRenderer(this.game, m, this.container)));

		this.updateGameMode();
	}

	deactivateInternal() {
		this.resetChildren();
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
				this.mainRenderer = new MapRenderer(this.game, this.model, this.mainLayer, this.rightPanel);
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
		this.model.triggerEvent('main-layer-resized', size);
	}

}
