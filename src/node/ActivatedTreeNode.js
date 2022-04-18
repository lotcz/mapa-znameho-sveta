/**
	Base for controller and renderer nodes.
 */
export default class ActivatedTreeNode {
	children;
	parent;
	isActivated;

	constructor() {
		this.isActivated = false;
		this.parent = null;
		this.children = [];
	}

	isRoot() {
		return (this.parent === null);
	}

	findRoot() {
		return (this.isRoot()) ? this : this.parent.findRoot();
	}

	/**
	 *
	 * @param node ActivatedTreeNode
	 * @returns ActivatedTreeNode
	 */
	addChild(node) {
		node.parent = this;
		this.children.push(node);
		if (this.isActivated) {
			node.activate();
		}
		return node;
	}

	hasChildren() {
		return this.children.length > 0;
	}

	removeChild(node) {
		const index = this.children.indexOf(node);
		if (index >= 0) {
			this.children.splice(index, 1);
			node.deactivate();
			return node;
		}
		for (let i = 0, max = this.children.length; i < max; i++) {
			const child = this.children[i];
			const result = child.removeChild(node);
			if (result) {
				return result;
			}
		}
	}

	resetChildren() {
		this.children.forEach((child) => child.deactivate());
		this.children = [];
	}

	forEach(func) {
		func(this);
		for (let i = 0, max = this.children.length; i < max; i++) {
			const child = this.children[i];
			child.forEach(func);
		}
	}

	activate() {
		if (!this.isActivated) {
			this.activateInternal();
			this.children.forEach((c) => c.activate());
			this.isActivated = true;
		}
	}

	activateInternal() {

	}

	deactivate() {
		if (this.isActivated) {
			this.children.forEach((c) => c.deactivate());
			this.isActivated = false;
			this.deactivateInternal();
		}
	}

	deactivateInternal() {

	}

}
