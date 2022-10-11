import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import StatNumberRenderer from "./StatNumberRenderer";

export default class StatCombatRenderer extends DomRenderer {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = this.addElement('div', 'stat-wrapper column flex-1 p-1');
		this.name = Pixies.createElement(this.container, 'div', 'stat-name center mb-1');
		this.bottom = Pixies.createElement(this.container, 'div', 'column center');
		this.numeric = Pixies.createElement(this.bottom, 'div', 'stat-badge row center');
		this.addChild(
			new StatNumberRenderer(
				this.game,
				this.model.currentFloat,
				this.numeric
			)
		);

		this.statDef = this.game.resources.statDefinitions.getById(this.model.definitionId.get());
		if (!this.statDef) {
			console.log('stat def not found', this.model.definitionId.get());
			return;
		}
		this.name.innerText = this.statDef.name.get();
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

}
