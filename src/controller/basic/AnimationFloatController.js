import ControllerNode from "./ControllerNode";
import AnimatedValue from "../../class/animating/AnimatedValue";

export default class AnimationFloatController extends ControllerNode {

	/**
	 * @type AnimatedValue
	 */
	animated;

	/**
	 * @type DirtyValue
	 */
	model;

	/**
	 *
	 * @param game GameModel
	 * @param model DirtyValue
	 * @param target Number
	 * @param duration Number
	 * @param elapsed Number
	 */
	constructor(game, model, target, duration, elapsed = 0) {
		super(game, model);
		this.model = model;
		this.animated = new AnimatedValue(model.get(), target, duration, elapsed);
	}

	updateInternal(delta) {
		this.model.set(this.animated.get(delta));
		if (this.animated.isFinished()) {
			this.removeMyself();
			this.model.triggerEvent('animation-finished');
		}
	}

}
