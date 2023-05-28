import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import StatNumberRenderer from "./StatNumberRenderer";
import StatNameRenderer from "./StatNameRenderer";
import NullableNodeRenderer from "../../../basic/NullableNodeRenderer";

export default class StatSkillRenderer extends DomRenderer {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom, isAbility = false, isSkill = false) {
		super(game, model, dom);

		this.model = model;
		this.statDef = null;

		this.isAbility = isAbility;
		this.isSkill = isSkill;
	}

	activateInternal() {
		this.container = this.addElement( 'div', 'stat-skill row my-1');

		this.name = Pixies.createElement(this.container, 'div', 'name');
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.definition,
				(m) => new StatNameRenderer(this.game, m, this.name)
			)
		);

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
		this.updateStat();
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

	renderInternal() {
		this.updateStat();
	}

	updateStat() {
		this.statDef = this.model.definition.get();
		if (!this.statDef) {
			console.log('stat def empty', this.model.definitionId.get());
			return;
		}

		const max = this.statDef.max.get();
		const base = this.model.baseValue.get();
		const current = this.model.current.get();
		Pixies.emptyElement(this.value);
		for (let i = 0; i < max; i++) {
			const brick = Pixies.createElement(this.value, 'div', 'stat-brick');
			if (i < current) {
				if (i >= base) {
					Pixies.addClass(brick, 'extra');
					if (this.isAbility) {
						brick.addEventListener('click', () => this.model.triggerEvent('remove-ability-point'));
					}
					if (this.isSkill) {
						brick.addEventListener('click', () => this.model.triggerEvent('remove-skill-point'));
					}
				} else {
					Pixies.addClass(brick, 'normal');
				}
			} else if (i < base) {
				Pixies.addClass(brick, 'loss');
			} else {
				if (this.isAbility) {
					brick.addEventListener('click', () => this.model.triggerEvent('add-ability-point'));
				}
				if (this.isSkill) {
					brick.addEventListener('click', () => this.model.triggerEvent('add-skill-point'));
				}
			}
		}
	}
}
