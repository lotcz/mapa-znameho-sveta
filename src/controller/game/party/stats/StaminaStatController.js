import StatControllerBase from "./StatControllerBase";

export default class StaminaStatController extends StatControllerBase {

	constructor(game, model, stats) {
		super(game, model, stats,  [stats.abilities.strength.current, stats.abilities.toughness.current, stats.abilities.agility.current]);
	}

	updateBase() {
		const strength = this.stats.abilities.strength.current.get();
		const toughness = this.stats.abilities.toughness.current.get();
		const agility = this.stats.abilities.agility.current.get();
		const stamina = (2 * strength) + (1 * toughness) + agility;

		const origRatio = this.model.currentFloat.get() / this.model.baseValue.get();
		this.model.baseValue.set(stamina);
		this.model.currentFloat.set(stamina * origRatio);
	}

}
