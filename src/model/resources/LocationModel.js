import DirtyValue from "../basic/DirtyValue";
import IdentifiedModelNode from "../basic/IdentifiedModelNode";
import Vector2 from "../basic/Vector2";
import ModelNodeCollection from "../basic/ModelNodeCollection";
import ConnectionModel from "./ConnectionModel";

export default class LocationModel extends IdentifiedModelNode {

	/**
	 * @type Vector2
	 */
	coordinates;

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type ModelNodeCollection
	 */
	connections;

	constructor(id) {
		super(id);

		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.coordinates.addOnChangeListener(() => this.triggerEvent('change', this));
		this.name = this.addProperty('name', new DirtyValue(''));
		this.connections = this.addProperty('connections', new ModelNodeCollection(() => new ConnectionModel()));
	}

}
