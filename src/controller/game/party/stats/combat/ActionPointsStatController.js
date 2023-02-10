import ComputedStatControllerBase from "../ComputedStatControllerBase";

export default class ActionPointsStatController extends ComputedStatControllerBase {

	constructor(game, model, stats) {
		super(game, model, stats, [stats.abilities.agility.current]);
	}

	updateBase() {
		const base = 5;
		const agility = this.stats.abilities.agility.current.get();
		const chance = base + (3 * agility);
		this.model.baseValue.set(chance);
	}

}
