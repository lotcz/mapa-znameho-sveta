import ModelNodeCollection from "./ModelNodeCollection";

/**
 * Collection of IdentifiedModelNode that allows search by ID.
 */
export default class ModelNodeTable extends ModelNodeCollection {

	getById(id) {
		return this.children.find((ch) => ch.id.equalsTo(id));
	}

	maxId() {
		if (this.children.count() === 0) {
			return 0;
		}
		return this.children.items.reduce((prev, current) => Math.max(prev, current.id.get()), 0);
	}

	createNode() {
		const node = this.nodeFactory(this.maxId() + 1);
		this.add(node);
		return node;
	}

}
