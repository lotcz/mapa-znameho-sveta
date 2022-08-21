import DirtyValue from "../basic/DirtyValue";
import IdentifiedModelNode from "../basic/IdentifiedModelNode";

export default class CharacterModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	raceId;

	/**
	 * @type DirtyValue
	 */
	portrait;

	constructor(id) {
		super(id);

		this.raceId = this.addProperty('raceId', new DirtyValue(0));
		this.portrait = this.addProperty('portrait', new DirtyValue('img/portrait/adelan/female-1.jpg'));

	}

}
