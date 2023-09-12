import AnimatedVector2 from "../../class/animating/AnimatedVector2";
import {EASING_FLAT} from "../../class/animating/ProgressValue";
import AnimationController from "./AnimationController";

export default class AnimationVector2Controller extends AnimationController {

	/**
	 * @type AnimatedVector2
	 */
	animatedVector;

	/**
	 * @type Vector2
	 */
	model;

	/**
	 *
	 * @param game GameModel
	 * @param model Vector2
	 * @param target Vector2
	 * @param duration Number
	 * @param easing (float) => float
	 * @param elapsed Number
	 */
	constructor(game, model, target, duration, easing = EASING_FLAT, elapsed = 0) {
		super(game, model);
		this.model = model;
		this.animatedVector = new AnimatedVector2(model, target, duration, easing, elapsed);
	}

	updateInternal(delta) {
		this.model.set(this.animatedVector.get(delta));
		if (this.animatedVector.isFinished()) {
			this.finished();
		}
	}

}
