import ComputedStatControllerBase from "../ComputedStatControllerBase";

export default class TemperatureStatController extends ComputedStatControllerBase {

	constructor(game, model, stats) {
		super(game, model, stats, []);
	}

	updateBase() {
		this.model.baseValue.set(10);
	}

}
