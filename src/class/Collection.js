import Node from "./Node";

export default class Collection extends Node {
	items;

	constructor() {
		super();
		this.items = [];
	}

	add(element) {
		this.items.push(element);
		this.triggerEvent('add', element);
		return element;
	}

	remove(element) {
		const index = this.items.indexOf(element);
		return this.removeInternal(index, element);
	}

	removeByIndex(index) {
		if (index >= 0 && index < this.items.length) {
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
			return element;
		}
		return false;
	}

	reset() {
		while (this.removeFirst()) {
		}
	}

	count() {
		return this.items.length;
	}

	removeFirst() {
		if (this.count() > 0) {
			return this.remove(this.first());
		}
		return false;
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
