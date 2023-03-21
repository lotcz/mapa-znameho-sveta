import DomRenderer from "../../../basic/DomRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";
import Pixies from "../../../../class/basic/Pixies";
import PartySlotRenderer from "./PartySlotRenderer";
import SwitchRenderer from "../../../basic/SwitchRenderer";

export default class PortraitsRenderer extends DomRenderer {

	/**
	 * @type PartyModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'column p-1 flex-1 space-between');
		this.portraits = Pixies.createElement(this.container, 'div');

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.slots,
				(m) => new PartySlotRenderer(this.game, m, this.portraits)
			)
		);

		this.controls = Pixies.createElement(this.container, 'div');

		this.addChild(
			new SwitchRenderer(
				this.game,
				this.model.battleScrollWhenMove,
				this.controls,
				'Scroll'
			)
		);

		this.addChild(
			new SwitchRenderer(
				this.game,
				this.model.battleFollowTheLeader,
				this.controls,
				'img/icon/follow.png'
			)
		);
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
		this.container = null;
	}

}
