import Node from "./Node";
const DEBUG_HASH_TABLE = false;

export default class Dictionary extends Node {
	keyValues;

	constructor() {
		super();
		this.keyValues = {};
	}

	get(key) {
		return this.keyValues[key];
	}

	exists(key) {
		return (this.keyValues[key] !== undefined);
	}

	add(key, value = null) {
		if (this.exists(key)) {
			console.log(this.keyValues);
			console.error(`Key ${key} already exists in dictionary.`);
			return;
		}
		this.keyValues[key] = value;
		this.triggerEvent('add', {key: key, value: value});
		return value;
	}

	set(key, value = null) {
		if (!this.exists(key)) {
			console.error(`Key ${key} doesn't exist in dictionary.`);
			return;
		}
		const old = this.get(key);
		this.keyValues[key] = value;
		this.triggerEvent('set', {key: key, oldValue: old, newValue: value});
		return value;
	}

	remove(key) {
		if (!this.exists(key)) {
			if (DEBUG_HASH_TABLE) console.log(`Key ${key} doesn't exist in hash table`);
			return;
		}
		const element = this.get(key);
		delete this.keyValues[key];
		this.triggerEvent('remove', {key: key, value: value});
		return element;
	}

	reset() {
		const keys = this.keys();
		keys.forEach((key) => this.remove(key));
		this.keyValues = [];
	}

	count() {
		return this.keys().length;
	}

	isEmpty() {
		return (this.count() === 0);
	}

	keys() {
		return Object.keys(this.keyValues);
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

	addOnSetListener(listener) {
		this.addEventListener('set', listener);
	}

	removeOnSetListener(listener) {
		this.removeEventListener('set', listener);
	}

	forEach(func) {
		for (let key in this.keyValues) {
			func(key, this.keyValues[key]);
		}
	}

}
