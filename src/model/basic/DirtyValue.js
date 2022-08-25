import ModelNode from "./ModelNode";

export default class DirtyValue extends ModelNode {
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
		return this.value === null || this.value === undefined;
	}

	isSet() {
		return !this.isEmpty();
	}

	getStateInternal() {
		return this.get();
	}

	equalsTo(value) {
		return (this.value === value);
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
