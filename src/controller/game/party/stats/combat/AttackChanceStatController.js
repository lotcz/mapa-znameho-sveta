import StatControllerBase from "../StatControllerBase";

export default class AttackChanceStatController extends StatControllerBase {

	constructor(game, model, stats) {
		super(game, model, stats, [stats.abilities.agility.current, stats.skills.meleeWeapons.current, stats.skills.missileWeapons.current]);
	}

	updateBase() {
		const meleeWeapons = this.stats.skills.meleeWeapons.current.get();
		const missileWeapons = this.stats.skills.missileWeapons.current.get();
		const agility = this.stats.abilities.agility.current.get();
		const chance = (1 * agility) + (1 * meleeWeapons)+ (1 * missileWeapons);
		this.model.baseValue.set(chance);
	}

}
