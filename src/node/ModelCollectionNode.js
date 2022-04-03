import ModelNode from "../node/ModelNode";
import Collection from "../class/Collection";

export default class ModelCollectionNode extends ModelNode {

	/**
	 * @type Collection
	 */
	children;

	nodeFactory;

	constructor(nodeFactory) {
		super();

		this.nodeFactory = nodeFactory;
		this.children = new Collection();
		this.children.addOnAddListener((child) => this.onChildAdded(child));
		this.children.addOnRemoveListener((child) => this.onChildRemoved(child));
		this.childDirtyHandler = (ch) => this.onChildDirty(ch);
	}

	add(child = null) {
		if (!child) {
			child = this.nodeFactory();
		}
		return this.children.add(child);
	}

	remove(child) {
		return this.children.remove(child);
	}

	getChildrenArray() {
		return this.children.items;
	}

	count() {
		return this.children.count();
	}

	clean() {
		if (this.isDirty) {
			super.clean();
			this.children.forEach((child) => child.clean());
		}
	}

	/**
	 *
	 * @param {ModelNode} child
	 */
	onChildAdded(child) {
		this.makeDirty();
		child.addOnDirtyListener(this.childDirtyHandler);
	}

	/**
	 *
	 * @param {ModelNode} child
	 */
	onChildRemoved(child) {
		this.makeDirty();
		child.removeOnDirtyListener('dirty', this.childDirtyHandler);
	}

	onChildDirty(child) {
		this.makeDirty();
	}

	getStateInternal() {
		const state = [];
		this.children.forEach((ch) => state.push(ch.getState()));
		return state;
	}

	restoreStateInternal(state) {
		this.children.reset();
		for (let i = 0, max = state.length; i < max; i++) {
			const child = this.nodeFactory(state[i]);
			child.restoreState(state[i]);
			this.children.add(child);
		}
	}
}
