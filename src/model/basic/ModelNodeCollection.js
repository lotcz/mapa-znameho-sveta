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

	constructor(nodeFactory = null, persistent = true) {
		super(persistent);

		this.nodeFactory = nodeFactory;
		this.children = new Collection();
		const events = ['add', 'remove', 'change'];
		events.forEach((event) => this.children.addEventListener(event, (param) => this.triggerEvent(event, param)));
		this.children.addOnAddListener((child) => this.onChildAdded(child));
		this.children.addOnRemoveListener((child) => this.onChildRemoved(child));
		this.childDirtyHandler = (ch) => this.onChildDirty(ch);
		this.childRequestedRemoveHandler = (ch) => this.remove(ch);

		this.selectedNode = this.addProperty('selectedNode', new NullableNode(null, false));

		this.addEventListener('drag-start', (child) => {
			this.selectedNode.set(child);
		});
		this.addEventListener('drag-drop', (child) => {
			const node = this.selectedNode.get();
			const startIndex = this.indexOf(node);
			const targetIndex = this.indexOf(child);
			if (startIndex === targetIndex) {
				return;
			}
			this.remove(node);
			this.insert(node, targetIndex);
			this.selectedNode.set(node);
		});
	}

	asArray() {
		return this.children.asArray();
	}

	addMultipleAsArray(children) {
		return children.map((ch) => this.add(ch));
	}

	/**
	 *
	 * @param {ModelNode | []} child
	 * @returns {ModelNode | [] | any}
	 */
	add(child = null) {
		if (Array.isArray(child)) return this.addMultipleAsArray(child);

		if (!child) {
			child = this.nodeFactory();
		}
		return this.children.add(child);
	}

	prepend(child) {
		return this.children.prepend(child);
	}

	insert(child, index) {
		return this.children.insert(child, index);
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

	indexOf(node) {
		return this.children.items.indexOf(node);
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

	swap(childA, childB) {
		this.children.swap(childA, childB);
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
		child.addEventListener('remove-me', this.childRequestedRemoveHandler);
	}

	/**
	 *
	 * @param {ModelNode} child
	 */
	onChildRemoved(child) {
		this.makeDirty();
		child.removeOnDirtyListener(this.childDirtyHandler);
		child.removeEventListener('remove-me', this.childRequestedRemoveHandler);
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

	getResourcesForPreload() {
		const result = super.getResourcesForPreload();
		this.children.forEach((ch) => result.push(...ch.getResourcesForPreload()));
		return Pixies.arrayUnique(result);
	}

}
