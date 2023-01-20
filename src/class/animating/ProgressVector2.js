import ProgressValue, {EASING_FLAT} from "./ProgressValue";
import Vector2 from "../../model/basic/Vector2";

export default class ProgressVector2 {
	progressX;
	progressY;

	constructor(start, end, easing = EASING_FLAT, progress = 0) {
		this.progressX = new ProgressValue(start.x, end.x, easing, progress);
		this.progressY = new ProgressValue(start.y, end.y, easing, progress);
	}

	setProgress(progress) {
		this.progressX.progress = progress;
		this.progressY.progress = progress;
	}

	get(progress = null) {
		if (progress !== null) this.setProgress(progress);
		return new Vector2(this.progressX.get(), this.progressY.get());
	}

}
