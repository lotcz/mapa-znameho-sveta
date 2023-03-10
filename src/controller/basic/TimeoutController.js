import ControllerNode from "./ControllerNode";

export default class TimeoutController extends ControllerNode {

	/**
	 *
	 * @param {GameModel} game
	 * @param {Number} duration
	 * @param {function} onFinished
	 */
	constructor(game, duration, onFinished) {
		super(game, null);
		this.duration = duration;
		this.timeout = duration;
		this.onFinished = onFinished;
	}

	updateInternal(delta) {
		this.timeout -= delta;
		if (this.timeout <= 0) {
			this.removeMyself();
			this.onFinished();
		}
	}

}
