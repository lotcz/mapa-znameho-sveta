import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import StatBarRenderer from "./StatBarRenderer";
import StatNameRenderer from "./StatNameRenderer";
import NullableNodeRenderer from "../../../basic/NullableNodeRenderer";

export default class StatConsumptionRenderer extends DomRenderer {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'stat-wrapper column mb-1');
		this.top = Pixies.createElement(this.container, 'div', 'row center');
		this.name = Pixies.createElement(this.top, 'div', 'stat-name');
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.definition,
				(m) => new StatNameRenderer(this.game, m, this.name)
			)
		);

		this.bottom = Pixies.createElement(this.container, 'div', 'flex-1');
		this.addChild(new StatBarRenderer(this.game, this.model, this.bottom));
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

}
