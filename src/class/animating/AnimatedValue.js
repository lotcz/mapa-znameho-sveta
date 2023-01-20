import ProgressValue, {EASING_FLAT} from "./ProgressValue";
import Pixies from "../basic/Pixies";

export default class AnimatedValue {
	progressValue;
	duration;

	constructor(start, end, duration, easing = EASING_FLAT, elapsed = 0) {
		this.progressValue = new ProgressValue(start, end, easing, elapsed);
		this.duration = duration;
		this.elapsed = elapsed;
		this.updateProgress();
	}

	addElapsed(delta) {
		this.elapsed += delta;
		this.updateProgress();
	}

	updateProgress() {
		this.progressValue.progress = Pixies.between(0, 1, this.elapsed / this.duration);
	}

	get(delta = null) {
		if (delta !== null) this.addElapsed(delta);
		return this.progressValue.get();
	}

	isFinished() {
		return (this.elapsed >= this.duration);
	}

}
