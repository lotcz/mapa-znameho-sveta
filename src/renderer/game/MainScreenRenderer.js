import DomRenderer from "../basic/DomRenderer";
import MapRenderer from "./map/MapRenderer";
import BattleRenderer from "./battle/BattleRenderer";
import ConversationRenderer from "./conversation/ConversationRenderer";
import NullableNodeRenderer from "../basic/NullableNodeRenderer";
import PartyRenderer from "./party/PartyRenderer";
import SelectedSlotRenderer from "./party/inventory/SelectedSlotRenderer";
import Pixies from "../../class/basic/Pixies";
import Vector2 from "../../model/basic/Vector2";

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
			this.model.party.isInventoryVisible,
			'change',
			() => this.mainLayerResized()
		);

		this.addAutoEvent(
			this.model,
			'trigger-resize',
			() => this.mainLayerResized()
		);

	}

	activateInternal() {
		this.container = this.addElement('div', 'main-screen-container container container-host');
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

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.currentBattle,
				(m) => new BattleRenderer(this.game, m, this.mainLayer),
				() => new MapRenderer(this.game, this.model, this.mainLayer, this.rightPanel)
			)
		);

		this.addChild(new NullableNodeRenderer(this.game, this.model.conversation, (m) => new ConversationRenderer(this.game, m, this.topLayer, this.model)));
		this.addChild(new NullableNodeRenderer(this.game, this.model.selectedInventorySlot, (m) => new SelectedSlotRenderer(this.game, m, this.container)));
		this.addChild(new PartyRenderer(this.game, this.model.party, this.partyPanel, this.topLayer));
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
		this.container = null;
	}

	mainLayerResized() {
		const size = new Vector2(this.mainLayer.offsetWidth, this.mainLayer.offsetHeight);
		this.model.triggerEvent('main-layer-resized', size);
	}

}
