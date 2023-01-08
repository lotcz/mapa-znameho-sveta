import ModelNode from "../../basic/ModelNode";


export default class CompletedStagesModel extends ModelNode {

	/**
	 * @type array<int>
	 */
	stages;

	constructor() {
		super();

		this.stages = [];
	}

	getStateInternal() {
		return this.stages;
	}

	restoreStateInternal(state) {
		this.stages = state;
	}

	isCompleted(id) {
		id = Number(id);
		return this.stages.includes(id);
	}

	complete(id) {
		id = Number(id);
		if (!this.isCompleted(id)) {
			this.stages.push(id);
			this.triggerEvent('stage-completed', id);
			this.makeDirty();
			return true;
		}
		return false;
	}

	forEach(func) {
		this.stages.forEach(func);
	}
}
