import ModelNode from "../../basic/ModelNode";
import FloatValue from "../../basic/FloatValue";

export default class QuestOverlayModel extends ModelNode {

	/**
	 * @type QuestStageModel
	 */
	quest;

	/**
	 * @type FloatValue
	 */
	opacity;

	constructor(quest) {
		super(false);

		this.quest = this.addProperty('quest', quest);
		this.opacity = this.addProperty('opacity', new FloatValue(0));

	}

}
