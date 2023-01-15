import ControllerSavedGameNode from "../../basic/ControllerSavedGameNode";
import NullableNodeController from "../../basic/NullableNodeController";
import SequenceStepController from "./SequenceStepController";
import Vector2 from "../../../model/basic/Vector2";

export default class SequenceController extends ControllerSavedGameNode {

	/**
	 * @type SequenceModel
	 */
	model;

	origBattle;
	origCoords;

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

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => {
				const diameter = Math.min(this.game.viewBoxSize.x, this.game.viewBoxSize.y) * 0.8;
				const size = new Vector2(diameter, diameter);
				const corner = this.game.viewBoxSize.subtract(size).multiply(0.5);
				this.model.theatreCoordinates.set(corner);
				this.model.theatreSize.set(size);
			},
			true
		);

		this.addAutoEvent(
			this.game.controls,
			'esc-key',
			() => {
				this.finished();
			}
		)

	}

	activateInternal() {
		/*
		this.origBattle = this.saveGame.currentBattle.get();
		this.origCoords = this.saveGame.mapCenterCoordinates.clone();
		*/
	}

	nextStep() {
		if (this.model.steps.count() <= this.currentIndex) {
			this.finished();
			return;
		}
		const index = this.currentIndex;
		this.currentIndex++;
		this.model.currentStep.set(this.model.steps.get(index));
	}

	finished() {
		this.model.currentStep.set(null);
		/*
		this.saveGame.mode.set(this.origMode);
		this.saveGame.mapCenterCoordinates.set(this.origCoords);
		 */
		this.saveGame.triggerEvent('sequence-finished');
	}

}
