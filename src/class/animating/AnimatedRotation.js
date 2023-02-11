import Pixies from "../basic/Pixies";
import ProgressRotation from "./ProgressRotation";
import {EASING_FLAT} from "./ProgressValue";

export default class AnimatedRotation {

	/**
	 * @type ProgressRotation
	 */
	progress;

	/**
	 * @type Number
	 */
	duration;

	/**
	 * @type Number
	 */
	elapsed;

	/**
	 *
	 * @param {Number} start
	 * @param {Number} end
	 * @param {Number} duration
	 * @param {Number} elapsed
	 */
	constructor(start, end, duration, easing = EASING_FLAT, elapsed = 0) {
		this.progress = new ProgressRotation(start, end, easing);
		this.duration = duration;
		this.elapsed = elapsed;
	}

	get(delta = null) {
		if (delta !== null) this.elapsed += delta;
		return this.progress.get(Pixies.between(0, 1, this.elapsed / this.duration));
	}

	isFinished() {
		return (this.elapsed >= this.duration);
	}

}
