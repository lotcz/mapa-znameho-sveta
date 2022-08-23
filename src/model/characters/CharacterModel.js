import DirtyValue from "../basic/DirtyValue";
import TemplateNode from "../basic/TemplateNode";

export default class CharacterModel extends TemplateNode {

	/**
	 * @type DirtyValue
	 */
	raceId;

	/**
	 * @type DirtyValue
	 */
	portrait;

	constructor(id = 0) {
		super(id);

		this.raceId = this.addProperty('raceId', new DirtyValue(0));
		this.portrait = this.addProperty('portrait', new DirtyValue('img/portrait/adelan/female-1.jpg'));

	}

}
