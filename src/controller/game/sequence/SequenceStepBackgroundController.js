import AnimationFloatController from "../../basic/AnimationFloatController";
import AnimationVector2Controller from "../../basic/AnimationVector2Controller";
import ControllerNode from "../../basic/ControllerNode";

export default class SequenceStepBackgroundController extends ControllerNode {

	/**
	 * @type SequenceStepBackgroundModel
	 */
	model;

	constructor(game, model, sequence) {
		super(game, model);

		this.model = model;
		this.sequence = sequence;

		this.timeout = 0;
		this.isFadingOut = false;

		this.addAutoEvent(
			this.game.controls,
			'zoom',
			(delta) => {
				if (!this.game.isInDebugMode.get()) return;
				let zoom = this.model.renderingImage.zoom.get();
				if (zoom === 0 && delta < 0) {
					zoom = 0.1;
				}
				zoom -= zoom * delta * 0.1;
					this.model.renderingImage.zoom.set(zoom);
			}
		);

		this.addAutoEvent(
			this.game.controls.mouseCoordinates,
			'change',
			(param) => {
				if (!this.game.isInDebugMode.get()) return;
				if (!this.game.controls.mouseDownRight.get()) return;
				const old = param.oldValue;
				const nov = param.newValue;
				const diff = nov.subtract(old).multiply(1 / this.model.renderingImage.zoom.get());
				const target = this.model.renderingImage.coordinates.subtract(diff);
				this.model.renderingImage.coordinates.set(target);
			}
		);

	}

	activateInternal() {
		this.model.renderingImage.zoom.set(this.model.startZoom.get());
		this.model.renderingImage.coordinates.set(this.model.startCoordinates);
		this.model.renderingImage.url.set(this.model.image.get());
		this.model.renderingImage.size.set(this.sequence.theatreSize);

		if (this.model.fadeInDuration.get() > 0) {
			this.model.renderingImage.opacity.set(0);
			this.addChild(
				new AnimationFloatController(
					this.game,
					this.model.renderingImage.opacity,
					1,
					this.model.fadeInDuration.get()
				)
			);
		} else {
			this.model.renderingImage.opacity.set(1);
		}

		const movementTimeout = this.model.fadeInDuration.get() + this.model.duration.get() + this.model.fadeOutDuration.get();

		if (!this.model.startZoom.equalsTo(this.model.endZoom.get())) {
			this.addChild(
				new AnimationFloatController(
					this.game,
					this.model.renderingImage.zoom,
					this.model.endZoom.get(),
					movementTimeout
				)
			);
		}

		if (!this.model.startCoordinates.equalsTo(this.model.endCoordinates)) {
			this.addChild(
				new AnimationVector2Controller(
					this.game,
					this.model.renderingImage.coordinates,
					this.model.endCoordinates,
					movementTimeout
				)
			);
		}

		this.timeout = this.model.fadeInDuration.get() + this.model.duration.get();
	}

	updateInternal(delta)
	{
		this.timeout -= delta;

		if (this.timeout <= 0) {
			if (this.isFadingOut) {
				this.finished();
				return;
			}

			this.nextStep();

			if (this.model.fadeOutDuration.equalsTo(0)) {
				this.finished();
				return;
			}

			this.isFadingOut = true;
			this.timeout += this.model.fadeOutDuration.get();
			this.addChild(
				new AnimationFloatController(
					this.game,
					this.model.renderingImage.opacity,
					0,
					this.timeout
				)
			);
		}
	}

	nextStep() {
		this.sequence.triggerEvent('sequence-next-step');
	}

	finished() {
		this.sequence.triggerEvent('sequence-step-finished', this.model);
	}

}
