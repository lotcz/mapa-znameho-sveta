/**
	Base for controller and renderer nodes.
 */
import Pixies from "./Pixies";

export default class ActivatedTreeNode {
	children;
	parent;
	isActivated;

	/**
	 *
	 * @type {[{param}]}
	 * @type param.node {ModelNode}
	 * @type param.event {string}
	 * @type param.handler {(ep) => any}
	 */
	autoRegisterEvents = [];

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

			this.autoRegisterEvents.forEach((event) => {
				event.node.addEventListener(event.name, event.handler);
			})
		}
	}

	activateInternal() {

	}

	deactivate() {
		if (this.isActivated) {
			this.autoRegisterEvents.forEach((event) => {
				event.node.removeEventListener(event.name, event.handler);
			})

			this.children.forEach((c) => c.deactivate());
			this.deactivateInternal();
			this.isActivated = false;
		}
	}

	deactivateInternal() {

	}

	addAutoEvent(node, event, handler) {
		this.autoRegisterEvents.push({node: node, name:event, handler: handler});
	}

	removeAutoEvent(node, name, handler) {
		const event = this.autoRegisterEvents.find((e) => e.handler === handler && e.name === name && e.node === node);
		if (event) {
			Pixies.arrayRemove(this.autoRegisterEvents, event);
		}
	}

}
