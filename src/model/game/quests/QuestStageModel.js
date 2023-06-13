import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import IntValue from "../../basic/IntValue";
import StringValue from "../../basic/StringValue";
import BoolValue from "../../basic/BoolValue";

export default class QuestStageModel extends IdentifiedModelNode {

	/**
	 * @type IntValue
	 */
	parentStageId;

	/**
	 * @type BoolValue
	 */
	isChapter;

	/**
	 * @type StringValue
	 */
	name;

	/**
	 * @type StringValue
	 */
	text;

	/**
	 * @type IntValue
	 */
	experience;

	constructor(id) {
		super(id);

		this.parentStageId = this.addProperty('parentStageId', new IntValue());
		this.isChapter = this.addProperty('isChapter', new BoolValue());
		this.name = this.addProperty('name', new StringValue(`Quest ${id}`));
		this.text = this.addProperty('text', new StringValue('text'));
		this.experience = this.addProperty('experience', new IntValue(100));
	}

	isQuest() {
		return this.parentStageId.isEmpty() || this.parentStageId.equalsTo(0);
	}

}
