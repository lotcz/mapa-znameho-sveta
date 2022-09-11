import ModelNode from "./ModelNode";
import {Vector3 as ThreeVector3} from "three";

export default class Vector3 extends ModelNode {
	x;
	y;
	z;

	constructor(x, y, z) {
		super();

		this.x = 0;
		this.y = 0;
		this.z = 0;

		if (y === undefined && typeof x === 'object') {
			if (x.length === 3) {
				this.setFromArray(x);
			} else {
				this.set(x);
			}
		} else if (x !== undefined && z !== undefined) {
			this.set(x, y, z);
		}
	}

	equalsTo(v) {
		return (v) ? this.x === v.x && this.y === v.y && this.z === v.z : false;
	}

	set(x, y, z) {
		if (y === undefined && typeof x === 'object') {
			this.set(x.x, x.y, x.z);
			return;
		}

		x = Number(x);
		y = Number(y);
		z = Number(z);

		if ((this.x !== x || this.y !== y || this.z !== z)) {
			const old = this.clone();
			this.x = x;
			this.y = y;
			this.z = z;
			this.makeDirty();
			this.triggerEvent('change', {oldValue: old, newValue: this});
		}
	}

	add(v) {
		return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
	}

	multiply(s) {
		return new Vector3(this.x * s, this.y * s, this.z * s);
	}

	subtract(v) {
		return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
	}

	toArray() {
		return [this.x, this.y, this.z];
	}

	setFromArray(arr) {
		if (typeof arr === 'object' && arr.length === 3) {
			this.set(arr[0], arr[1], arr[2]);
		}
	}

	static fromArray(arr) {
		const v = new Vector3();
		v.setFromArray(arr);
		return v;
	}

	clone() {
		return new Vector3(this);
	}

	getStateInternal() {
		return this.toArray();
	}

	restoreStateInternal(state) {
		this.setFromArray(state);
	}

	getThree() {
		return new ThreeVector3(this.x, this.y, this.z);
	}

}
