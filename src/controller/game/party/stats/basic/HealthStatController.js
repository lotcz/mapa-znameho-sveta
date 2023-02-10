import ComputedStatControllerBase from "../ComputedStatControllerBase";

export default class HealthStatController extends ComputedStatControllerBase {

	constructor(game, model, stats) {
		super(game, model, stats, [stats.abilities.strength.current, stats.abilities.toughness.current]);
	}

	updateBase() {
		const base = 5;
		const strength = this.stats.abilities.strength.current.get();
		const toughness = this.stats.abilities.toughness.current.get();
		const health = base + (1 * strength) + (2 * toughness);

		const origRatio = this.model.baseValue.get() > 0 ? this.model.currentFloat.get() / this.model.baseValue.get() : 1;
		this.model.baseValue.set(health);
		this.model.currentFloat.set(health * origRatio);
	}

}
