import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import InventoryStatNumberRenderer from "./InventoryStatNumberRenderer";

export default class InventorySkillRenderer extends DomRenderer {

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
		this.container = this.addElement( 'div', 'stat row stretch');
		this.left = Pixies.createElement(this.container, 'div', 'row');
		this.name = Pixies.createElement(this.left, 'div', 'flex-1');
		this.numeric = Pixies.createElement(this.left, 'div');
		this.addChild(
			new InventoryStatNumberRenderer(
				this.game,
				this.model.currentFloat,
				this.numeric
			)
		);
		this.right = Pixies.createElement(this.container, 'div', 'flex-1');
		this.value = Pixies.createElement(this.right, 'div', 'row');
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
