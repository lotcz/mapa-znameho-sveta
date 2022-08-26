import DirtyValue from "../basic/DirtyValue";
import TemplateNode from "../basic/TemplateNode";
import IntValue from "../basic/IntValue";

export default class CharacterModel extends TemplateNode {

	/**
	 * @type IntValue
	 */
	raceId;

	/**
	 * @type DirtyValue
	 */
	portrait;

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 */
	sex;

	/**
	 * @type DirtyValue
	 */
	skinColor;

	/**
	 * @type DirtyValue
	 */
	hairColor;

	constructor(id = 0) {
		super(id);

		this.raceId = this.addProperty('raceId', new IntValue(0));
		this.portrait = this.addProperty('portrait', new DirtyValue('img/portrait/adelan/female-1.jpg'));
		this.name = this.addProperty('name', new DirtyValue('Jinka'));

	}

}
