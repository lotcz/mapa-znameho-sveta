import ModelNode from "../../basic/ModelNode";

export default class RunningConversationLineModel extends ModelNode {

	/**
	 * @type RunningConversationModel
	 */
	conversation;

	/**
	 * @type RunningConversationEntryModel
	 */
	entry;

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

		this.conversation = conversation;
		this.entry = entry;
		this.line = line;
		this.isResponse = isResponse;

	}

}
