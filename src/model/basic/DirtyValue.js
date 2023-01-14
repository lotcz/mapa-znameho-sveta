import ModelNode from "./ModelNode";

export default class DirtyValue extends ModelNode {
	/** @type object|number|string|null */
	value = null;

	constructor(value = null, persistent = true) {
		super(persistent);
		this.set(value);
	}

	set(value) {
		if (this.value !== value) {
			const old = this.value;
			this.value = value;
			this.makeDirty();
			this.triggerOnChangeEvent(old);
		}
	}

	get() {
		return this.value;
	}

	isEmpty() {
		return this.value === null || this.value === undefined || Number.isNaN(this.value);
	}

	isSet() {
		return !this.isEmpty();
	}

	getStateInternal() {
		return this.get();
	}

	equalsTo(value) {
		return (this.value === value || (typeof value === 'object' && value !== null && value.value === this.value));
	}

	restoreStateInternal(state) {
		this.set(state);
	}

	addOnChangeListener(eventHandler) {
		this.addEventListener('change', eventHandler);
	}

	removeOnChangeListener(eventHandler) {
		this.removeEventListener('change', eventHandler);
	}

	triggerOnChangeEvent(oldValue) {
		this.triggerEvent('change', {oldValue: oldValue, newValue: this.value});
	}

}
