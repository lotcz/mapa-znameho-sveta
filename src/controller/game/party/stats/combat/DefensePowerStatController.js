import StatControllerBase from "../StatControllerBase";

export default class DefensePowerStatController extends StatControllerBase {

	constructor(game, model, stats) {
		super(game, model, stats, [stats.abilities.toughness.current]);
	}

	updateBase() {
		const base = 1;
		const toughness = this.stats.abilities.toughness.current.get();
		const power = base + (1 * toughness);
		this.model.baseValue.set(power);
	}

}
