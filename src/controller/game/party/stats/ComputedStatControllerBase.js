import StatController from "./StatController";

export default class ComputedStatControllerBase extends StatController {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, stats, dependencies = []) {
		super(game, model, stats);

		this.model = model;
		this.stats = stats;

		dependencies.forEach((dep) => {
			this.addAutoEvent(
				dep,
				'change',
				() => this.updateBase()
			);
		});
	}

	afterActivatedInternal() {
		super.afterActivatedInternal();
		this.updateBase();
	}

	updateBase() {
	}

}
