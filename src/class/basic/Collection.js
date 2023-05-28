import Node from "./Node";

export default class Collection extends Node {

	/**
	 * @type array
	 */
	items;

	constructor() {
		super();
		this.items = [];
	}

	asArray() {
		return this.items;
	}

	add(element) {
		this.items.push(element);
		this.triggerEvent('add', element);
		this.triggerEvent('change');
		return element;
	}

	insert(element, index) {
		this.items.splice(index, 0, element);
		this.triggerEvent('insert', element);
		this.triggerEvent('change');
		return element;
	}

	prepend(element) {
		return this.insert(element, 0);
	}

	remove(element) {
		const index = this.items.indexOf(element);
		return this.removeInternal(index, element);
	}

	removeByIndex(index) {
		if (index >= 0 && index < this.count()) {
			return this.removeInternal(index, this.items[index]);
		}
		return false;
	}

	removeInternal(index, element) {
		if (index >= 0) {
			this.items.splice(index, 1);
		}
		if (element) {
			this.triggerEvent('remove', element);
			this.triggerEvent('change');
			return element;
		}
		return false;
	}

	reset() {
		while (this.removeFirst()) {
		}
	}

	isEmpty() {
		return this.count() <= 0;
	}

	count() {
		return this.items.length;
	}

	contains(item) {
		return this.items.includes(item);
	}

	removeFirst() {
		return this.removeByIndex(0);
	}

	removeLast() {
		return this.removeByIndex(this.count() - 1);
	}

	swap(childA, childB) {
		const indexA = this.items.indexOf(childA);
		if (indexA < 0) {
			return;
		}
		this.removeInternal(indexA, childA);

		const indexB = this.items.indexOf(childB);
		if (indexB < 0) {
			this.insert(childA, indexA);
			return;
		}
		this.removeInternal(indexB, childB);

		this.insert(childA, indexB);
		this.insert(childB, indexA);
	}

	first() {
		return this.items[0];
	}

	last() {
		return this.items[this.items.length - 1];
	}

	forEach(func) {
		this.items.forEach(func);
	}

	filter(func) {
		return this.items.filter(func);
	}

	find(func) {
		return this.items.find(func);
	}

	map(transform) {
		return this.items.map(transform);
	}

	reduce(callback, initial) {
		return this.items.reduce(callback, initial);
	}

	sort(sortFunc) {
		return this.items.sort(sortFunc);
	}

	addOnRemoveListener(listener) {
		this.addEventListener('remove', listener);
	}

	removeOnRemoveListener(listener) {
		this.removeEventListener('remove', listener);
	}

	addOnAddListener(listener) {
		this.addEventListener('add', listener);
	}

	removeOnAddListener(listener) {
		this.removeEventListener('add', listener);
	}

}
