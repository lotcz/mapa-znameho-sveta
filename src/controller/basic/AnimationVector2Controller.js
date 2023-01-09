import ControllerNode from "./ControllerNode";
import AnimatedVector2 from "../../class/animating/AnimatedVector2";

export default class AnimationVector2Controller extends ControllerNode {

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
	 * @param elapsed Number
	 */
	constructor(game, model, target, duration, elapsed = 0) {
		super(game, model);
		this.model = model;
		this.animatedVector = new AnimatedVector2(model, target, duration, elapsed);
	}

	updateInternal(delta) {
		this.model.set(this.animatedVector.get(delta));
		if (this.animatedVector.isFinished()) {
			this.removeMyself();
			this.model.triggerEvent('animation-finished');
		}
	}

}
