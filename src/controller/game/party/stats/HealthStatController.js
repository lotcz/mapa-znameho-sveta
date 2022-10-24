import StatControllerBase from "./StatControllerBase";

export default class HealthStatController extends StatControllerBase {

	constructor(game, model, stats) {
		super(game, model, stats, [stats.abilities.strength.current, stats.abilities.toughness.current]);
	}

	updateBase() {
		const strength = this.stats.abilities.strength.current.get();
		const toughness = this.stats.abilities.toughness.current.get();
		const health = (1 * strength) + (2 * toughness);

		const origRatio = this.model.currentFloat.get() / this.model.baseValue.get();
		this.model.baseValue.set(health);
		this.model.currentFloat.set(health * origRatio);
	}

}
