import ModelNode from "../../basic/ModelNode";
import DirtyValue from "../../basic/DirtyValue";

export default class RunningConversationLineModel extends ModelNode {

	/**
	 * @type RunningConversationModel
	 */
	runningConversation;

	/**
	 * @type RunningConversationEntryModel
	 */
	runningEntry;

	/**
	 * @type ConversationLineModel
	 */
	line;

	/**
	 * @type DirtyValue
	 */
	isResponse;

	constructor(conversation, entry, line, isResponse) {
		super();

		this.runningConversation = conversation;
		this.runningEntry = entry;
		this.line = line;
		this.isResponse = new DirtyValue(isResponse);

	}

}
