import ModelNodeCollection from "./ModelNodeCollection";

/**
 * Collection of IdentifiedModelNode that allows search by ID.
 */
export default class ModelNodeTable extends ModelNodeCollection {

	getById(id) {
		if (id === null || id === undefined || id === '') {
			return null;
		}
		return this.children.find((ch) => ch.id.value == id);
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

	createNode() {
		const node = this.nodeFactory(this.maxId() + 1);
		this.add(node);
		return node;
	}

}
