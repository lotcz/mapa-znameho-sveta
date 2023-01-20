export const EASING_FLAT = (x) => x;
export const EASING_EXPONENTIAL_IN = (x, e = 2) => Math.pow(x,e);
export const EASING_EXPONENTIAL_IN_OUT = (x, e = 2) => (x <= 0.5) ? Math.pow(x * 2, e) / 2 : 1 - Math.pow(2 - x * 2, e) / 2;
export const EASING_QUAD_IN = EASING_EXPONENTIAL_IN;
export const EASING_QUAD_IN_OUT = EASING_EXPONENTIAL_IN_OUT;
export const EASING_CUBIC_IN = (x) => EASING_EXPONENTIAL_IN(x, 3);
export const EASING_CUBIC_IN_OUT = (x) => EASING_EXPONENTIAL_IN_OUT(x, 3);

export default class ProgressValue {
	start;
	end;
	progress;
	easing;

	constructor(start, end, easing = EASING_FLAT, progress = 0) {
		this.start = Number(start);
		this.diff = Number(end) - this.start;
		this.easing = easing;
		this.progress = Number(progress);
	}

	get(progress = null) {
		if (progress !== null) this.progress = Number(progress);
		return this.start + (this.easing(this.progress) * this.diff);
	}

}
