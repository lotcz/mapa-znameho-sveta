import ComputedStatControllerBase from "../ComputedStatControllerBase";

export default class AttackPowerStatController extends ComputedStatControllerBase {

	constructor(game, model, stats) {
		super(game, model, stats, [stats.abilities.strength.current]);
	}

	updateBase() {
		const base = 1;
		const strength = this.stats.abilities.strength.current.get();
		const power = base + (1 * strength);
		this.model.baseValue.set(power);
	}

}
