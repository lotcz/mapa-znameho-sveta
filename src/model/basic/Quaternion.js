import ModelNode from "./ModelNode";

export default class Quaternion extends ModelNode {
	x;
	y;
	z;
	w;

	constructor(x, y, z, w) {
		super();

		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.w = 0;

		if (y === undefined && typeof x === 'object') {
			if (x.length === 4) {
				this.setFromArray(x);
			} else {
				this.set(x);
			}
		} else if (x !== undefined && w !== undefined) {
			this.set(x, y, z, w);
		}
	}

	equalsTo(v) {
		return (v) ? this.x === v.x && this.y === v.y && this.z === v.z  && this.w === v.w : false;
	}

	set(x, y, z, w) {
		if (y === undefined && typeof x === 'object') {
			this.set(x.x, x.y, x.z, x.w);
			return;
		}

		x = Number(x);
		y = Number(y);
		z = Number(z);
		w = Number(w);

		if ((this.x !== x || this.y !== y || this.z !== z || this.w !== w)) {
			const old = this.clone();
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
			this.makeDirty();
			this.triggerEvent('change', {oldValue: old, newValue: this});
		}
	}

	toArray() {
		return [this.x, this.y, this.z, this.w];
	}

	setFromArray(arr) {
		if (typeof arr === 'object' && arr.length === 4) {
			this.set(arr[0], arr[1], arr[2], arr[3]);
		}
	}

	static fromArray(arr) {
		const v = new Quaternion();
		v.setFromArray(arr);
		return v;
	}

	clone() {
		return new Quaternion(this);
	}

	getStateInternal() {
		return this.toArray();
	}

	restoreStateInternal(state) {
		this.setFromArray(state);
	}

}
