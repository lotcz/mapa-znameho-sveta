/**
 * Keeps track of rotation in radians, these are always in interval (-pi, +pi>
 */
export default class ProgressRotation {
	start;
	end;
	progress;

	constructor(start, end, progress = 0) {
		this.start = start;
		this.end = end;
		this.progress = progress;
	}

	get(progress = null) {
		if (progress !== null) this.progress = progress;
		return this.start + (this.progress * (this.end - this.start));
	}

}
