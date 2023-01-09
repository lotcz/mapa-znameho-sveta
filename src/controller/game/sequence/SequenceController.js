import ControllerSavedGameNode from "../../basic/ControllerSavedGameNode";
import NullableNodeController from "../../basic/NullableNodeController";
import SequenceStepController from "./SequenceStepController";

export default class SequenceController extends ControllerSavedGameNode {

	/**
	 * @type SequenceModel
	 */
	model;

	constructor(game, model, saveGame) {
		super(game, model, saveGame);

		this.model = model;

		this.currentIndex = 0;

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.currentStep,
				(m) => new SequenceStepController(this.game, m, this.saveGame)
			)
		);

		this.addAutoEvent(
			this.saveGame,
			'sequence-step-finished',
			() => this.nextStep(),
			true
		);

	}

	nextStep() {
		if (this.model.steps.count() <= this.currentIndex) {
			this.saveGame.triggerEvent('sequence-finished');
			return;
		}
		const index = this.currentIndex;
		this.currentIndex++;
		this.model.currentStep.set(this.model.steps.get(index));
	}

}
