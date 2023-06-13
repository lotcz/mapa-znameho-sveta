import ModelNodeCollection from "./ModelNodeCollection";

/**
 * Collection of IdentifiedModelNode that allows search by ID.
 */
export default class ModelNodeTable extends ModelNodeCollection {

	getById(id) {
		if (id === null || id === undefined || id === '') {
			return null;
		}
		if (typeof id === 'object' && id.constructor.name === 'IntValue') {
			return this.getById(id.get());
		}
		const i = Number(id);
		if (i === Number.NaN || i <= 0) {
			return null;
		}
		return this.children.find((ch) => ch.id.equalsTo(i));
	}

	get(id) {
		return this.getById(id);
	}

	maxId() {
		if (this.children.count() === 0) {
			return 0;
		}
		return this.children.items.reduce((prev, current) => Math.max(prev, parseInt(current.id.get())), 0);
	}

	nextId() {
		return this.maxId() + 1;
	}

	add(node) {
		const id = this.nextId();
		if (!node) {
			node = this.nodeFactory(id);
		}
		node.id.set(id);
		super.add(node);
		return node;
	}

	addClone(node) {
		const clone = node.clone();
		clone.id.set(this.nextId());
		return this.insert(clone, this.indexOf(node) + 1);
	}

}
