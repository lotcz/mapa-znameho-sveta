import ControllerSavedGameNode from "../../basic/ControllerSavedGameNode";
import AnimationVector2Controller from "../../basic/AnimationVector2Controller";
import AnimationFloatController from "../../basic/AnimationFloatController";

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

		this.addChild(
			new AnimationFloatController(
				this.game,
				this.saveGame.zoom,
				this.model.zoom.get(),
				this.model.duration.get()
			)
		);

		this.addAutoEventMultiple(
			[this.saveGame.mapCenterCoordinates, this.saveGame.zoom],
			'animation-finished',
			() => {
				if (this.children.length === 0) {
					this.saveGame.triggerEvent('sequence-step-finished');
				}
			}
		);
	}

}
