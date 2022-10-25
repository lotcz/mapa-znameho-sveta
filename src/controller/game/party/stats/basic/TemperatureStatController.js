import StatControllerBase from "../StatControllerBase";

export default class TemperatureStatController extends StatControllerBase {

	constructor(game, model, stats) {
		super(game, model, stats, []);
	}

	updateBase() {
		const statDef = this.game.resources.statDefinitions.getById(this.model.definitionId.get());
		this.model.baseValue.set(statDef.max.get());
	}

}
