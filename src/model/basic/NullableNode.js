import DirtyValue from "./DirtyValue";

export default class NullableNode extends DirtyValue {
	nodeFactory;

	constructor(nodeFactory) {
		super();

		this.nodeFactory = nodeFactory;
	}

	/**
	 *
	 * @param {ModelNode} value
	 */
	set(value) {
		if (this.value) {
			this.removeDirtyListener(this.value);
		}

		super.set(value);

		if (this.value) {
			this.addDirtyListener(this.value);
		}
	}

	getStateInternal() {
		if (this.isSet()) {
			return this.get().getState();
		}
		return null;
	}

	restoreStateInternal(state) {
		this.set(null);
		if (state) {
			const node = this.nodeFactory();
			node.restoreState(state);
			this.set(node);
		}
	}

	clean() {
		if (this.isDirty) {
			super.clean();
			if (this.isSet()) {
				this.value.clean();
			}
		}
	}

	cleanAll() {
		super.cleanAll();
		if (this.isSet()) {
			this.value.cleanAll();
		}
	}

}
