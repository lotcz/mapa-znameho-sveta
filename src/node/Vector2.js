import ModelNode from "./ModelNode";
import Rotation from "./Rotation";

export default class Vector2 extends ModelNode {
	x;
	y;

	constructor(x, y) {
		super();
		this.x = 0;
		this.y = 0;
		if (y === undefined && typeof x === 'object') {
			if (x.length === 2) {
				this.setFromArray(x);
			} else {
				this.set(x);
			}
		} else if (x !== undefined) {
			this.set(x, y);
		}
	}

	distanceTo(v) {
		return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
	}

	equalsTo(v) {
		return (v) ? this.x === v.x && this.y === v.y : false;
	}

	set(x, y) {
		if (y === undefined && typeof x === 'object') {
			this.set(x.x, x.y);
			return;
		}
		if (this.x !== x || this.y !== y) {
			const old = this.clone();
			this.x = x;
			this.y = y;
			this.makeDirty();
			this.triggerEvent('change', {oldValue: old, newValue: this});
		}
	}

	size() {
		return this.distanceTo(new Vector2(0, 0));
	}

	setSize(size) {
		const currentSize = this.size();
		if (currentSize !== 0) {
			const ratio = size / currentSize;
			this.set(this.x * ratio, this.y * ratio);
		}
	}

	add(v) {
		return new Vector2(this.x + v.x, this.y + v.y);
	}

	multiply(s) {
		return new Vector2(this.x * s, this.y * s);
	}

	subtract(v) {
		return new Vector2(this.x - v.x, this.y - v.y);
	}

	toArray() {
		return [this.x, this.y];
	}

	setFromArray(arr) {
		if (typeof arr === 'object' && arr.length === 2) {
			this.set(arr[0],arr[1]);
		}
	}

	static fromArray(arr) {
		const v = new Vector2();
		v.setFromArray(arr);
		return v;
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	getStateInternal() {
		return this.toArray();
	}

	restoreStateInternal(state) {
		this.setFromArray(state);
	}

	/***
	 * Return angle between AB and Y axis
	 * @param Vector2 b
	 * @returns {number}
	 */
	getAngleToY(b) {
		const diff = this.subtract(b);
		const left = diff.x > 0;
		const down = diff.y < 0;
		const sinX = diff.x / diff.size();
		const x = Math.asin(sinX);
		const angle = -x * 180 / Math.PI;
		const result = down ? left ? (-90 - (90 + angle)) : (90 + (90 - angle)) : angle;
		return result || 0;
	}

	getRotation(target) {
		return Rotation.normalizeValue(this.getAngleToY(target) + 180);
	}

	addOnChangeListener(eventHandler) {
		this.addEventListener('change', eventHandler);
	}

	removeOnChangeListener(eventHandler) {
		this.removeEventListener('change', eventHandler);
	}

}
