import ModelNode from "./ModelNode";
import Rotation from "./Rotation";

export default class Vector2 extends ModelNode {
	x;
	y;

	constructor(x, y, persistent) {
		super(persistent);

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

	/**
	 *
	 * @param x Number|Vector2
	 * @param y Number|undefined
	 */
	set(x, y = undefined) {
		if (y === undefined && typeof x === 'object') {
			this.set(x.x, x.y);
			return;
		}

		x = Number(x);
		y = Number(y);

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
		return this;
	}

	round() {
		return new Vector2(Math.round(this.x), Math.round(this.y));
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
	 * Return angle between AB and Y axis in radians
	 * @param {Vector2} b
	 * @returns {number}
	 */
	getAngleToYAxis(b) {
		const diff = b.subtract(this);
		const down = diff.y < 0;
		const sinX = diff.x / diff.size();
		const angle = Math.asin(sinX);
		const result = down ?
			Math.PI - angle :
			angle;
		return result || 0;
	}

	getNeighborPositions(size = 1, includeCenter = false) {
		const neighbors = [];
		const maxX = this.x + size;
		for (let x = this.x - size; x <= maxX; x++) {
			const maxY = this.y + size;
			for (let y = this.y - size; y <= maxY; y++) {
				const n = new Vector2(x, y);
				if (includeCenter || !this.equalsTo(n)) {
					neighbors.push(n);
				}
			}
		}
		return neighbors;
	}

	getClosest(positions) {
		if ((!positions) || positions.length === 0) return null;
		if (positions.length === 1) return positions[0];
		let closest = positions[0];
		let distance = this.distanceTo(closest);
		for (let i = 1, max = positions.length; i < max; i++) {
			const d = this.distanceTo(positions[i]);
			if (d < distance) {
				closest = positions[i];
				distance = d;
			}
		}
		return closest;
	}

	/**
	 * If you are standing at this vector and looking at target vector, this will be rotation that you have to Y axis.
	 * @param {Vector2} target
	 * @returns {Rotation}
	 */
	getRotationFromYAxis(target) {
		return new Rotation(this.getAngleToYAxis(target));
	}

	addOnChangeListener(eventHandler) {
		this.addEventListener('change', eventHandler);
	}

	removeOnChangeListener(eventHandler) {
		this.removeEventListener('change', eventHandler);
	}

	toString() {
		return `[${this.x},${this.y}]`;
	}
}
