import StatControllerBase from "../StatControllerBase";

export default class StaminaStatController extends StatControllerBase {

	constructor(game, model, stats) {
		super(game, model, stats,  [stats.abilities.willpower.current]);
	}

	updateBase() {
		const willpower = this.stats.abilities.willpower.current.get();
		const base = 5;
		const stamina = base + (2 * willpower);

		const origRatio = this.model.currentFloat.get() / this.model.baseValue.get();
		this.model.baseValue.set(stamina);
		this.model.currentFloat.set(stamina * origRatio);
	}

}
