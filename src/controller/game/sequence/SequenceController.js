import ControllerSavedGameNode from "../../basic/ControllerSavedGameNode";
import NullableNodeController from "../../basic/NullableNodeController";
import SequenceStepController from "./SequenceStepController";
import {GAME_MODE_MAP} from "../../../model/game/SaveGameModel";

export default class SequenceController extends ControllerSavedGameNode {

	/**
	 * @type SequenceModel
	 */
	model;

	origMode;
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

	}

	activateInternal() {
		this.origMode = this.saveGame.mode.get();
		this.origCoords = this.saveGame.mapCenterCoordinates.clone();
		this.saveGame.mode.set(GAME_MODE_MAP);
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
		this.saveGame.mode.set(this.origMode);
		this.saveGame.mapCenterCoordinates.set(this.origCoords);
		this.saveGame.triggerEvent('sequence-finished');
	}

}
