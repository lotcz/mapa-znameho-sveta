import StatControllerBase from "../StatControllerBase";

export default class DefenseChanceStatController extends StatControllerBase {

	constructor(game, model, stats) {
		super(game, model, stats, [stats.abilities.agility.current, stats.skills.evasion.current]);
	}

	updateBase() {
		const evasion = this.stats.skills.evasion.current.get();
		const agility = this.stats.abilities.agility.current.get();
		const chance = (1 * agility) + (2 * evasion);
		this.model.baseValue.set(chance);
	}

}
