import ControllerNode from "../../../basic/ControllerNode";

export default class StatControllerBase extends ControllerNode {

	/**
	 * @type StatModel
	 */
	model;

	/**
	 * @type CharacterStatsModel
	 */
	stats;

	constructor(game, model, stats, dependencies = []) {
		super(game, model);

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

	activateInternal() {
		this.updateBase();
	}

	updateBase() {
	}

}
