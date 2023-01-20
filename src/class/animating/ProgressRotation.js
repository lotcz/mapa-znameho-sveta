import Rotation from "../../model/basic/Rotation";
import {EASING_FLAT} from "./ProgressValue";

export default class ProgressRotation {

	/**
	 * @type Number
	 */
	start;

	/**
	 * @type Number
	 */
	distance;

	/**
	 * @type Number
	 */
	progress;

	/**
	 *
	 * @param {Number} start
	 * @param {Number} end
	 * @param {(float) => float} easing
	 * @param {Number} progress
	 */
	constructor(start, end, easing = EASING_FLAT, progress = 0) {
		this.start = Rotation.normalizeValue(start);
		this.distance = Rotation.diff(end, start);
		this.easing = easing;
		this.progress = progress;
	}

	get(progress = null) {
		if (progress !== null) this.progress = progress;
		return Rotation.normalizeValue(this.start + (this.easing(this.progress) * this.distance));
	}

}
