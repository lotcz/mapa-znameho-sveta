import Node from "../../class/basic/Node";
import Dictionary from "../../class/basic/Dictionary";

export default class ModelNode extends Node {

	/**
	 * @type Dictionary
	 */
	properties;

	/**
	 * @type boolean
	 */
	isDirty;

	constructor() {
		super();
		this.isDirty = true;
		this.properties = new Dictionary();
		this.properties.addOnAddListener((param) => this.propertyAdded(param.key, param.value));
		this.properties.addOnRemoveListener((param) => this.propertyRemoved(param.key, param.value));
		this.properties.addOnSetListener((param) => this.propertySet(param.key, param.oldValue, param.newValue));
		this.propertyValueDirtyHandler = () => this.propertyDirty();
	}

	restoreState(state) {
		if (state.p) {
			this.properties.forEach((name, property) => property.restoreState(state.p[name]));
		}
		if (state.i) {
			this.restoreStateInternal(state.i);
		}
	}

	/**
	 * Override with node specific code
	 * @param {} state
	 */
	restoreStateInternal(state) {

	}

	getState() {
		const state = {};

		if (this.properties.count() > 0) {
			const properties = {};
			this.properties.forEach((name, propertyNode) =>
				properties[name] = propertyNode.getState()
			);
			state.p = properties;
		}

		const internal = this.getStateInternal();
		if (internal !== undefined) {
			state.i = internal;
		}

		return state;
	}

	/**
	 * Override with node specific state
	 * @returns {any}
	 */
	getStateInternal() {
		return undefined;
	}

	makeDirty() {
		if (!this.isDirty) {
			this.isDirty = true;
			this.triggerEvent('dirty');
		}
	}

	clean() {
		if (this.isDirty) {
			this.isDirty = false;
			this.properties.forEach((name, property) => property.clean());
		}
	}

	addProperty(name, property) {
		return this.properties.add(name, property);
	}

	propertyAdded(name, property) {
		this.makeDirty();
		property.addEventListener('dirty', this.propertyValueDirtyHandler);
	}

	propertyRemoved(name, property) {
		this.makeDirty();
		property.removeEventListener('dirty', this.propertyValueDirtyHandler);
	}

	propertySet(name, oldProperty, newProperty) {
		this.propertyRemoved(name, oldProperty);
		this.propertyAdded(name, newProperty);
	}

	propertyDirty() {
		this.makeDirty();
	}

	addOnDirtyListener(handler) {
		this.addEventListener('dirty', handler);
	}

	removeOnDirtyListener(handler) {
		this.removeEventListener('dirty', handler);
	}

}
