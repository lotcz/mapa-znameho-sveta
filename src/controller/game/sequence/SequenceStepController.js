import ControllerSavedGameNode from "../../basic/ControllerSavedGameNode";

export default class SequenceStepController extends ControllerSavedGameNode {

	/**
	 * @type SequenceStepModel
	 */
	model;

	constructor(game, model, saveGame) {
		super(game, model, saveGame);

		this.model = model;

		this.timeout = this.model.duration.get();

	}

	updateInternal(delta) {
		this.timeout -= delta;
		if (this.timeout <= 0) {
			this.removeMyself();
			this.saveGame.triggerEvent('sequence-step-finished');
		}

	}

}
