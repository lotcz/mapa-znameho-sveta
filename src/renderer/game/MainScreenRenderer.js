import DomRenderer from "../basic/DomRenderer";
import MapRenderer from "./map/MapRenderer";
import BattleRenderer from "./battle/BattleRenderer";
import ConversationRenderer from "./conversation/ConversationRenderer";
import NullableNodeRenderer from "../basic/NullableNodeRenderer";
import PartyRenderer from "./party/PartyRenderer";
import SelectedSlotRenderer from "./party/inventory/SelectedSlotRenderer";
import Pixies from "../../class/basic/Pixies";
import Vector2 from "../../model/basic/Vector2";
import MainMenuRenderer from "./MainMenuRenderer";
import QuestOverlayRenderer from "./quests/QuestOverlayRenderer";

export default class MainScreenRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

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
			this.model,
			'resize',
			() => this.mainLayerResized()
		);

	}

	activateInternal() {
		this.container = this.addElement('div', 'main-screen-container container container-host');
		const bottomLayer = Pixies.createElement(this.container, 'div', 'bottom-layer container container-host row stretch');
		this.topLayer = Pixies.createElement(this.container, 'div', 'top-layer ');

		this.partyPanel = Pixies.createElement(bottomLayer, 'div', 'savegame-party row stretch');
		this.partyPanel.addEventListener('wheel', (e) => e.stopPropagation());

		this.mainLayer = Pixies.createElement(bottomLayer, 'div', 'main stretch flex-1 container-host');
		this.mainBottom = Pixies.createElement(this.mainLayer, 'div', 'container container-host');
		this.completedQuestContainer = Pixies.createElement(this.mainLayer, 'div', 'completed-quest-container container-host');
		this.conversationContainer = Pixies.createElement(this.mainLayer, 'div', 'conversation-container container-host');

		this.mainLayer.addEventListener(
			'mousemove',
			(e) => {
				const bcr = this.mainLayer.getBoundingClientRect();
				const position = new Vector2(e.pageX - bcr.left, e.pageY - bcr.top);
				this.model.triggerEvent('mousemove', position);
			}
		);

		this.rightPanel = Pixies.createElement(bottomLayer, 'div', 'right-panel row stretch');

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.currentBattle,
				(m) => new BattleRenderer(this.game, m, this.mainBottom),
				() => new MapRenderer(this.game, this.model, this.mainBottom)
			)
		);

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.conversation,
				(m) => new ConversationRenderer(this.game, m, this.conversationContainer, this.model)
			)
		);

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.completedQuestOverlay,
				(m) => new QuestOverlayRenderer(this.game, m, this.completedQuestContainer)
			)
		);

		this.addChild(new MainMenuRenderer(this.game, this.model, this.rightPanel));
		this.addChild(new SelectedSlotRenderer(this.game, this.model.selectedItemSlot, this.container));
		this.addChild(new PartyRenderer(this.game, this.model.party, this.partyPanel, this.topLayer));

		// PRELOAD
		this.game.assets.preload(this.model.party.getResourcesForPreload());
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
		this.container = null;
	}

	mainLayerResized() {
		const size = new Vector2(this.mainLayer.offsetWidth, this.mainLayer.offsetHeight);
		this.model.triggerEvent('resized', size);
	}

}
