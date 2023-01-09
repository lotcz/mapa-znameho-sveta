import ControllerSavedGameNode from "../../basic/ControllerSavedGameNode";
import AnimationVector2Controller from "../../basic/AnimationVector2Controller";

export default class SequenceStepController extends ControllerSavedGameNode {

	/**
	 * @type SequenceStepModel
	 */
	model;

	constructor(game, model, saveGame) {
		super(game, model, saveGame);

		this.model = model;

		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.saveGame.mapCenterCoordinates,
				this.model.coordinates,
				this.model.duration.get()
			)
		);

		this.addAutoEvent(
			this.saveGame.mapCenterCoordinates,
			'animation-finished',
			() => this.saveGame.triggerEvent('sequence-step-finished')
		);
	}

}
