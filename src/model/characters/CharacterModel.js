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

		this.raceId = this.addProperty('raceId', new DirtyValue(0));
		this.portrait = this.addProperty('portrait', new DirtyValue('img/portrait/adelan/female-1.jpg'));
		this.name = this.addProperty('name', new DirtyValue('Jinka'));

	}

}
