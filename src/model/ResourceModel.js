import DirtyValue from "../node/DirtyValue";
import IdentifiedModelNode from "../node/IdentifiedModelNode";
import Vector2 from "../node/Vector2";
import ModelNodeCollection from "../node/ModelNodeCollection";
import ConnectionModel from "./ConnectionModel";

export default class ResourceModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 */
	type;

	/**
	 * @type DirtyValue
	 */
	textureUri;

	/**
	 * @type ModelNodeCollection
	 */
	connections;

	constructor(id, name) {
		super(id, name);

		this.name = this.addProperty('name', new DirtyValue(''));

		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.coordinates.addOnChangeListener(() => this.triggerEvent('change', this));
		this.name = this.addProperty('name', new DirtyValue(''));
		this.connections = this.addProperty('connections', new ModelNodeCollection(() => new ConnectionModel()));
	}

}
