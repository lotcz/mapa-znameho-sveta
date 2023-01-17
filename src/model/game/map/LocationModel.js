import DirtyValue from "../../basic/DirtyValue";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import Vector2 from "../../basic/Vector2";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import ConnectionModel from "./ConnectionModel";
import IntValue from "../../basic/IntValue";

export default class LocationModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type Vector2
	 */
	coordinates;

	/**
	 * @type IntValue
	 */
	battleMapId;

	/**
	 * @type IntValue
	 */
	biotopeId;

	/**
	 * @type ModelNodeCollection<ConnectionModel>
	 */
	connections;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Location ${id}`));
		this.coordinates = this.addProperty('startCoordinates', new Vector2());
		this.battleMapId = this.addProperty('battleMapId', new IntValue(0));

		this.biotopeId = this.addProperty('biotopeId', new IntValue(0));

		this.connections = this.addProperty('connections', new ModelNodeCollection(null, false));
	}

	addConnection(path, forward = true) {
		const conn = new ConnectionModel(this);
		conn.pathId.set(path.id.get());
		conn.forward.set(forward);
		return this.connections.add(conn);
	}

	updateConnections(paths) {
		this.connections.reset();
		paths.forEach((path) => {
			if (path.startLocationId.equalsTo(this.id.get())) {
				this.addConnection(path);
			} else if (path.endLocationId.equalsTo(this.id.get())) {
				this.addConnection(path, false);
			}
		});
	}

}
