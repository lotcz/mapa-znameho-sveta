import StatControllerBase from "../StatControllerBase";

export default class TemperatureStatController extends StatControllerBase {

	constructor(game, model, stats) {
		super(game, model, stats, [stats.abilities.toughness.current]);
	}

	updateBase() {
		const toughness = this.stats.abilities.toughness.current.get();
		const statDef = this.game.resources.statDefinitions.getById(this.model.definitionId.get());
		const maxTemp = statDef.max.get() + toughness;
		const base = maxTemp / 2;
		this.model.baseValue.set(base);
	}

}
