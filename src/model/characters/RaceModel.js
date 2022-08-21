import DirtyValue from "../basic/DirtyValue";
import IdentifiedModelNode from "../basic/IdentifiedModelNode";

export default class RaceModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 */
	description;

	/**
	 * @type DirtyValue
	 */
	skinColor;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue('Adelan'));
		this.description = this.addProperty('description', new DirtyValue('Popis národa'));
		this.skinColor = this.addProperty('color', new DirtyValue('#006000'));
	}

}
