import ControllerSavedGameNode from "../../basic/ControllerSavedGameNode";
import Vector2 from "../../../model/basic/Vector2";
import CollectionController from "../../basic/CollectionController";
import SequenceStepBackgroundController from "./SequenceStepBackgroundController";

export default class SequenceController extends ControllerSavedGameNode {

	/**
	 * @type SequenceModel
	 */
	model;

	constructor(game, model, saveGame) {
		super(game, model, saveGame);

		this.model = model;

		this.indexBg = 0;
		this.indexText = 0;

		this.timeoutText = 0;

		this.addChild(
			new CollectionController(
				this.game,
				this.model.runningSteps,
				(m) => new SequenceStepBackgroundController(this.game, m, this.model)
			)
		);

		this.addAutoEvent(
			this.model,
			'sequence-next-step',
			() => this.nextStepBg()
		);

		this.addAutoEvent(
			this.model,
			'sequence-step-finished',
			(m) => this.model.runningSteps.remove(m)
		);

		this.addAutoEvent(
			this.model.runningSteps,
			'remove',
			() => {
				if (this.isFinished()) {
					this.finished();
				}
			}
		);

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => {
				const width = this.game.viewBoxSize.x * 0.6;
				const size = new Vector2(width, width / 2.4);
				const corner = this.game.viewBoxSize.subtract(size).multiply(0.5);
				this.model.theatreCoordinates.set(corner);
				this.model.theatreSize.set(size);
				this.model.runningSteps.forEach((step) => step.renderingImage.size.set(size));
			},
			true
		);

		this.addAutoEvent(
			this.game.controls,
			'esc-key',
			() => {
				this.finished();
			}
		);

	}

	activateInternal() {
		this.model.text.set('');
		this.model.runningSteps.reset();
		this.model.sounds.reset();
		this.nextStepText();
		this.nextStepBg();
	}

	update(delta) {
		if (!this.game.isInDebugMode.get()) {
			super.update(delta);
		}
	}

	updateInternal(delta)
	{
		this.timeoutText -= delta;
		if (this.timeoutText <= 0) {
			this.nextStepText();
		}
	}

	nextStepText() {
		if (this.isTextFinished()) {
			if (this.isFinished()) {
				this.finished();
			}
			return;
		}
		const step = this.model.stepsText.get(this.indexText);
		this.model.text.set(step.text.get());
		if (step.audioUrl.isSet()) {
			const sound = this.game.audio.playSound(step.audioUrl.get());
			this.model.sounds.add(sound);
		}
		this.indexText++;
		this.timeoutText = step.duration.get();
	}

	nextStepBg() {
		if (this.isBackgroundFinished()) {
			if (this.isFinished()) {
				this.finished();
			}
			return;
		}
		const step = this.model.stepsBg.get(this.indexBg);
		this.indexBg++;
		this.model.runningSteps.add(step);
	}

	isFinished() {
		return this.isTextFinished() &&	this.isBackgroundFinished() && this.model.runningSteps.isEmpty();
	}

	isTextFinished() {
		return this.model.stepsText.count() <= this.indexText && this.timeoutText <= 0;
	}

	isBackgroundFinished() {
		return this.model.stepsBg.count() <= this.indexBg;
	}

	finished() {
		this.model.runningSteps.reset();
		this.model.sounds.forEach((audio) => this.game.audio.removeSound(audio));
		this.model.sounds.reset();
		this.saveGame.triggerEvent('sequence-finished');
	}

}
