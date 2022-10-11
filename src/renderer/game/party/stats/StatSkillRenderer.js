import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import StatNumberRenderer from "./StatNumberRenderer";

export default class StatSkillRenderer extends DomRenderer {

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
		this.container = this.addElement( 'div', 'stat-skill row my-1');
		this.name = Pixies.createElement(this.container, 'div', 'name');
		this.numeric = Pixies.createElement(this.container, 'div');
		this.addChild(
			new StatNumberRenderer(
				this.game,
				this.model.currentFloat,
				this.numeric
			)
		);
		this.right = Pixies.createElement(this.container, 'div', 'flex-1');
		this.value = Pixies.createElement(this.right, 'div', 'row value');
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

		const max = this.statDef.max.get();
		const base = this.model.baseValue.get();
		const current = this.model.current.get();
		Pixies.emptyElement(this.value);
		for (let i = 0; i < max; i++) {
			const brick = Pixies.createElement(this.value, 'div', 'stat-brick');
			if (i < current) {
				if (i >= base) {
					Pixies.addClass(brick, 'extra');
				} else {
					Pixies.addClass(brick, 'normal');
				}
			} else if (i < base) {
				Pixies.addClass(brick, 'loss');
			}
		}
	}
}