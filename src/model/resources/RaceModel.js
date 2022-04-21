import DirtyValue from "../basic/DirtyValue";
import IdentifiedModelNode from "../basic/IdentifiedModelNode";

export default class RaceModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	description;

	/**
	 * @type DirtyValue
	 */
	skinColor;

	constructor(id, name) {
		super(id, name);

		this.description = this.addProperty('description', new DirtyValue('Popis národa'));
		this.skinColor = this.addProperty('color', new DirtyValue('#006000'));
	}

}
