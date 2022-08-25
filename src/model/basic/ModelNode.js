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

	/**
	 * @type boolean
	 */
	isPersistent;

	/**
	 * @type boolean
	 */
	isHydrated;

	/**
	 * @type GameModel|null
	 */
	autoHydrateFrom;

	constructor(persistent = true) {
		super();
		this.isPersistent = persistent;
		this.isDirty = true;
		this.isHydrated = false;
		this.autoHydrateFrom = null;
		this.properties = new Dictionary();
		this.properties.addOnAddListener((param) => this.propertyAdded(param.key, param.value));
		this.properties.addOnRemoveListener((param) => this.propertyRemoved(param.key, param.value));
		this.properties.addOnSetListener((param) => this.propertySet(param.key, param.oldValue, param.newValue));
		this.propertyValueDirtyHandler = () => this.propertyDirty();
	}

	restoreState(state) {
		if (state === null || state === undefined || typeof state !== 'object') {
			return;
		}
		if (state.p) {
			this.properties.forEach((name, property) => property.restoreState(state.p[name]));
		}
		if (state.i !== undefined) {
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
		if (!this.isPersistent) {
			return null;
		}

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

	cleanAll() {
		this.clean();
		this.properties.forEach((name, property) => property.cleanAll());
	}

	clone() {
		const n = new this.constructor();
		n.restoreState(this.getState());
		return n;
	}

	/**
	 * @param {GameModel} game
	 */
	hydrate(game) {
		this.hydrateInternal(game);
		this.properties.forEach((name, property) => property.hydrate(game));
		this.isHydrated = true;
	}

	/**
	 * @param {GameModel} game
	 */
	hydrateInternal(game) {}

	/**
	 * @param {GameModel|null} game
	 */
	setAutoHydrate(game) {
		this.autoHydrateFrom = game;
		if (this.autoHydrateFrom && !this.isHydrated) {
			this.hydrate(this.autoHydrateFrom);
		}
	}

	stopAutoHydrate() {
		this.setAutoHydrate(null);
	}

	autoHydrate() {
		if (this.autoHydrateFrom) {
			this.hydrate(this.autoHydrateFrom);
		}
	}

	addDirtyListener(node) {
		node.addOnDirtyListener(this.propertyValueDirtyHandler);
		return node;
	}

	removeDirtyListener(node) {
		node.removeOnDirtyListener(this.propertyValueDirtyHandler);
		return node;
	}

	addProperty(name, property) {
		return this.properties.add(name, property);
	}

	propertyAdded(name, property) {
		this.makeDirty();
		this.addDirtyListener(property);
	}

	propertyRemoved(name, property) {
		this.makeDirty();
		this.removeDirtyListener(property);
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
