import ModelNode from "./ModelNode";
import Collection from "../../class/basic/Collection";
import Pixies from "../../class/basic/Pixies";
import NullableNode from "./NullableNode";

export default class ModelNodeCollection extends ModelNode {

	/**
	 * @type Collection
	 */
	children;

	nodeFactory;

	/**
	 * @type NullableNode
	 */
	selectedNode;

	constructor(nodeFactory, persistent = true) {
		super(persistent);

		this.nodeFactory = nodeFactory;
		this.children = new Collection();
		const events = ['add', 'remove', 'change'];
		events.forEach((evnt) => this.children.addEventListener(evnt, (param) => this.triggerEvent(evnt, param)));
		this.children.addOnAddListener((child) => this.onChildAdded(child));
		this.children.addOnRemoveListener((child) => this.onChildRemoved(child));
		this.childDirtyHandler = (ch) => this.onChildDirty(ch);

		this.selectedNode = this.addProperty('selectedNode', new NullableNode(null, false));
	}

	/**
	 *
	 * @param {ModelNode | any} child
	 * @returns {ModelNode | any}
	 */
	add(child = null) {
		if (!child) {
			child = this.nodeFactory();
		}
		return this.children.add(child);
	}

	prepend(child) {
		this.children.prepend(child);
	}

	remove(child) {
		return this.children.remove(child);
	}

	contains(item) {
		return this.children.contains(item);
	}

	first() {
		return this.children.first();
	}

	last() {
		return this.children.last();
	}

	random() {
		return Pixies.randomElement(this.children.items);
	}

	get(i) {
		return this.children.items[i];
	}

	count() {
		return this.children.count();
	}

	isEmpty() {
		return (this.count() === 0);
	}

	hasAny() {
		return (!this.isEmpty());
	}

	find(search) {
		return this.children.find(search);
	}

	filter(search) {
		return this.children.filter(search);
	}

	map(transform) {
		return this.children.map(transform);
	}

	reduce(callback, initial) {
		return this.children.reduce(callback, initial);
	}

	sort(sortFunc) {
		return this.children.sort(sortFunc);
	}

	forEach(func) {
		return this.children.forEach(func);
	}

	clean() {
		if (this.isDirty) {
			super.clean();
			this.children.forEach((child) => child.clean());
		}
	}

	cleanAll() {
		this.clean();
		this.children.forEach((child) => child.cleanAll());
	}

	reset() {
		this.children.reset();
	}

	addOnAddListener(handler) {
		this.children.addOnAddListener(handler);
	}

	removeOnAddListener(handler) {
		this.children.removeOnAddListener(handler);
	}

	addOnRemoveListener(handler) {
		this.children.addOnRemoveListener(handler);
	}

	removeOnRemoveListener(handler) {
		this.children.removeOnRemoveListener(handler);
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
		child.removeOnDirtyListener(this.childDirtyHandler);
		if (this.selectedNode.equalsTo(child)) {
			this.selectedNode.set(null);
		}
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
		if (!this.nodeFactory) {
			console.log('no factory for restoring ModelNodeCollection');
			return;
		}
		for (let i = 0, max = state.length; i < max; i++) {
			const child = this.nodeFactory();
			child.restoreState(state[i]);
			this.children.add(child);
		}
	}
}
