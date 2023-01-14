import ControllerSavedGameNode from "../../basic/ControllerSavedGameNode";

const FADEOUT_TIME = 2000;

export default class SequenceStepController extends ControllerSavedGameNode {

	/**
	 * @type SequenceStepModel
	 */
	model;

	constructor(game, model, saveGame) {
		super(game, model, saveGame);

		this.model = model;

		this.timeout = this.model.duration.get() + FADEOUT_TIME;
	}

	activateInternal() {
		this.fadingOut = false;
	}

	updateInternal(delta) {
		this.timeout -= delta;
		if (this.timeout <= (2 * FADEOUT_TIME) && !this.fadingOut) {
			this.fadingOut = true;
			this.model.triggerEvent('fade-out');
		}
		if (this.timeout <= 0) {
			this.removeMyself();
			this.saveGame.triggerEvent('sequence-step-finished');
		}

	}

}
