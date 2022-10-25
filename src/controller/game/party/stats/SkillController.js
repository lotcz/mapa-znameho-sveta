import ControllerNode from "../../../basic/ControllerNode";

export default class SkillController extends ControllerNode {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, stats) {
		super(game, model);

		this.model = model;
		this.stats = stats;

		this.addAutoEvent(
			this.stats.statEffects,
			'change',
			() => this.updateCurrent()
		);

		this.addAutoEvent(
			this.model.baseValue,
			'change',
			() => this.updateCurrent(),
			true
		);
	}

	updateCurrent() {
		const effects = this.stats.statEffects.filter((eff) => eff.statId.equalsTo(this.model.definitionId.get()));
		const total = effects.reduce((prev, current) => prev + current.amount.get(), 0);
		this.model.currentFloat.set(this.model.baseValue.get() + total);
	}

}
