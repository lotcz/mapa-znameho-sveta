import DirtyValue from "../../basic/DirtyValue";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import IntValue from "../../basic/IntValue";

export default class QuestStageModel extends IdentifiedModelNode {

	/**
	 * @type IntValue
	 */
	parentStageId;

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 */
	text;

	/**
	 * @type IntValue
	 */
	experience;

	constructor(id) {
		super(id);

		this.parentStageId = this.addProperty('parentStageId', new IntValue());
		this.name = this.addProperty('name', new DirtyValue(`Quest ${id}`));
		this.text = this.addProperty('text', new DirtyValue('text'));
		this.experience = this.addProperty('experience', new IntValue(100));
	}

	isQuest() {
		return this.parentStageId.isEmpty() || this.parentStageId.equalsTo(0);
	}

}
