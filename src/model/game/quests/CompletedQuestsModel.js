import ModelNode from "../../basic/ModelNode";


export default class CompletedQuestsModel extends ModelNode {

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
			this.triggerEvent('quest-completed', id);
			this.makeDirty();
			return true;
		}
		return false;
	}

	forEach(func) {
		this.stages.forEach(func);
	}
}
