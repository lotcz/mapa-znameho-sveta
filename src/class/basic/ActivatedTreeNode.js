import Pixies from "./Pixies";

export default class ActivatedTreeNode {
	children;

	/**
	 * @type ActivatedTreeNode
	 */
	parent;

	/**
	 * @type boolean
	 */
	isActivated;

	/**
	 *
	 * @type {[{param}]}
	 * @type param.node {ModelNode}
	 * @type param.event {string}
	 * @type param.handler {(ep) => any}
	 */
	autoRegisterEvents = null;

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
			node.parent = null;
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

	removeMyself() {
		if (this.parent) {
			this.parent.removeChild(this);
		} else {
			this.deactivate();
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

			if (this.autoRegisterEvents) {
				this.autoRegisterEvents.forEach((event) => {
					event.node.addEventListener(event.name, event.handler);
					if (event.runOnActivate) {
						event.handler();
					}
				});
			}

			this.children.forEach((c) => c.activate());
			this.isActivated = true;

			this.afterActivatedInternal();
		}
	}

	activateInternal() {

	}

	afterActivatedInternal() {

	}

	deactivate() {
		if (this.isActivated) {
			if (this.autoRegisterEvents) {
				this.autoRegisterEvents.forEach((event) => {
					event.node.removeEventListener(event.name, event.handler);
				});
			}

			this.children.forEach((c) => c.deactivate());
			this.deactivateInternal();
			this.isActivated = false;
		}
	}

	deactivateInternal() {

	}

	/**
	 *
	 * @param node ModelNode
	 * @param event string
	 * @param handler (param) => any
	 * @param runOnActivate bool
	 */
	addAutoEvent(node, event, handler, runOnActivate = false) {
		if ((!node) || typeof node.addEventListener !== 'function') {
			console.error('Node with addEventListener was not provided!');
		}
		if (!this.autoRegisterEvents) {
			this.autoRegisterEvents = [];
		}
		this.autoRegisterEvents.push({node: node, name:event, handler: handler, runOnActivate: runOnActivate});
	}

	addAutoEventMultiple(nodes, event, handler, runOnActivate = false) {
		if (!Array.isArray(nodes)) {
			console.error('Node array was not provided!');
		}
		nodes.forEach((n, i) => this.addAutoEvent(n, event, handler, i === 0 && runOnActivate));
	}

	removeAutoEvent(node, name, handler) {
		if (!this.autoRegisterEvents) {
			return;
		}
		const event = this.autoRegisterEvents.find((e) => e.handler === handler && e.name === name && e.node === node);
		if (event) {
			Pixies.arrayRemove(this.autoRegisterEvents, event);
		}
	}

}
