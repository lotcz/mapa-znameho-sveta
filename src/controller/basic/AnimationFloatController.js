import ControllerNode from "./ControllerNode";
import AnimatedValue from "../../class/animating/AnimatedValue";
import {EASING_FLAT} from "../../class/animating/ProgressValue";

export default class AnimationFloatController extends ControllerNode {

	/**
	 * @type DirtyValue
	 */
	model;

	/**
	 * @type AnimatedValue
	 */
	animated;

	/**
	 *
	 * @param game GameModel
	 * @param model DirtyValue
	 * @param target Number
	 * @param duration Number
	 * @param easing (float) => float
	 * @param elapsed Number
	 */
	constructor(game, model, target, duration, easing = EASING_FLAT, elapsed = 0) {
		super(game, model);
		this.model = model;
		this.animated = new AnimatedValue(model.get(), target, duration, easing, elapsed);
	}

	updateInternal(delta) {
		this.model.set(this.animated.get(delta));
		if (this.animated.isFinished()) {
			this.removeMyself();
			this.model.triggerEvent('animation-finished');
		}
	}

}
