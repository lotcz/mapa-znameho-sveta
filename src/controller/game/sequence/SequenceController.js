import ControllerSavedGameNode from "../../basic/ControllerSavedGameNode";
import Vector2 from "../../../model/basic/Vector2";
import AnimationFloatController from "../../basic/AnimationFloatController";
import AnimationVector2Controller from "../../basic/AnimationVector2Controller";

export default class SequenceController extends ControllerSavedGameNode {

	/**
	 * @type SequenceModel
	 */
	model;

	constructor(game, model, saveGame) {
		super(game, model, saveGame);

		this.model = model;

		this.currentIndex = 0;

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => {
				const width = this.game.viewBoxSize.x * 0.6;
				const size = new Vector2(width, width / 2.4);
				const corner = this.game.viewBoxSize.subtract(size).multiply(0.5);
				this.model.theatreCoordinates.set(corner);
				this.model.theatreSize.set(size);
				this.model.dualImage.size.set(size);
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
		this.model.dualImage.imageA.url.set('');
		this.model.dualImage.imageB.url.set('');
		this.nextStep();
	}

	updateInternal(delta)
	{
		if (this.model.currentStep.isEmpty()) {
			return;
		}
		this.timeout -= delta;
		if (this.timeout <= 0) {
			this.nextStep();
		}
	}

	nextStep() {
		if (this.model.steps.count() <= this.currentIndex) {
			this.finished();
			return;
		}
		const index = this.currentIndex;
		this.currentIndex++;
		const step = this.model.steps.get(index);
		this.model.currentStep.set(step);
		this.timeout = step.duration.get();

		this.model.currentText.set(step.text.get());
		this.model.dualImage.imageA.restoreState(this.model.dualImage.imageB.getState());
		this.model.dualImage.imageB.opacity.set(0);
		this.model.dualImage.imageB.zoom.set(step.zoom.get());
		this.model.dualImage.imageB.coordinates.set(step.coordinates);
		this.model.dualImage.imageB.url.set(step.image.get());

		if (this.model.dualImage.imageB.url.isSet()) {
			this.addChild(
				new AnimationFloatController(
					this.game,
					this.model.dualImage.imageB.opacity,
					1,
					3000
				)
			);
		} else if (this.model.dualImage.imageA.url.isSet()) {
			this.addChild(
				new AnimationFloatController(
					this.game,
					this.model.dualImage.imageA.opacity,
					0,
					3000
				)
			);
		}

		// TEST

		this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.dualImage.imageB.zoom,
				this.model.dualImage.imageB.zoom.get() * 1.05,
				step.duration.get()
			)
		);

		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.dualImage.imageB.coordinates,
				this.model.dualImage.imageB.coordinates.add(new Vector2(50, 50)),
				step.duration.get()
			)
		);

	}

	finished() {
		this.model.currentStep.set(null);
		this.saveGame.triggerEvent('sequence-finished');
	}

}
