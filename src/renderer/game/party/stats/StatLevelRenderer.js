import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import StatNumberRenderer from "./StatNumberRenderer";

export default class StatLevelRenderer extends DomRenderer {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.statDef = null;
	}

	activateInternal() {
		this.container = this.addElement( 'div', 'stat-level row my-1');
		this.name = Pixies.createElement(this.container, 'div', 'name');
		this.numeric = Pixies.createElement(this.container, 'div');
		this.addChild(
			new StatNumberRenderer(
				this.game,
				this.model.currentFloat,
				this.numeric
			)
		);
		this.statDef = this.game.resources.statDefinitions.getById(this.model.definitionId.get());
		this.updateStat();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		this.updateStat();
	}

	updateStat() {
		if (!this.statDef) {
			console.log('stat def empty', this.model.definitionId.get());
			return;
		}

		this.name.innerText = this.statDef.name.get();
	}
}
