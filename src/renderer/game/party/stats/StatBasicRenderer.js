import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import StatNumberRenderer from "./StatNumberRenderer";
import StatBarRenderer from "./StatBarRenderer";
import StatNameRenderer from "./StatNameRenderer";
import NullableNodeRenderer from "../../../basic/NullableNodeRenderer";

export default class StatBasicRenderer extends DomRenderer {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'stat-wrapper column flex-1 mx-3 px-3');
		this.top = Pixies.createElement(this.container, 'div', 'column');
		this.name = Pixies.createElement(this.top, 'div', 'stat-name center');
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.definition,
				(m) => new StatNameRenderer(this.game, m, this.name)
			)
		);

		this.bottom = Pixies.createElement(this.container, 'div', 'bottom row-reverse center');

		this.bar = Pixies.createElement(this.bottom, 'div', 'stat-basic-bar flex-1');
		this.addChild(new StatBarRenderer(this.game, this.model, this.bar));

		this.numeric = Pixies.createElement(this.bottom, 'div', 'stat-badge paper row center');
		this.addChild(
			new StatNumberRenderer(
				this.game,
				this.model.currentFloat,
				this.numeric
			)
		);
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

}
