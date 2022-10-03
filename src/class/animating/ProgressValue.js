export default class ProgressValue {
	start;
	end;
	progress;

	constructor(start, end, progress = 0) {
		this.start = Number(start);
		this.end = Number(end);
		this.progress = Number(progress);
	}

	get(progress = null) {
		if (progress !== null) this.progress = Number(progress);
		return this.start + (this.progress * (this.end - this.start));
	}

}
