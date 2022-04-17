import DirtyValue from "./DirtyValue";

export default class NullableNode extends DirtyValue {
	nodeFactory;

	constructor(nodeFactory) {
		super();

		this.nodeFactory = nodeFactory;
		this.valueDirtyHandler = () => this.makeDirty();
	}

	/**
	 *
	 * @param {ModelNode} value
	 */
	set(value) {
		super.set(value);
		if (this.value) {
			this.value.removeOnDirtyListener(this.valueDirtyHandler);
		}
		if (value) {
			this.value.addOnDirtyListener(this.valueDirtyHandler);
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
			const node = this.nodeFactory(state);
			node.restoreState(state);
			this.set(node);
		}
	}

}
