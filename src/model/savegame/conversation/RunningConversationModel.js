import ModelNodeCollection from "../../basic/ModelNodeCollection";
import RunningConversationEntryModel from "./RunningConversationEntryModel";
import NullableNode from "../../basic/NullableNode";
import ModelNode from "../../basic/ModelNode";

export default class RunningConversationModel extends ModelNode {

	/**
	 * @type ConversationModel
	 */
	conversation;

	/**
	 * @type NullableNode
	 */
	currentEntry;

	/**
	 * @type ModelNodeCollection
	 */
	pastEntries;

	constructor(conversation) {
		super();
		this.conversation = conversation;
		this.currentEntry = this.addProperty('currentEntry', new NullableNode(() => new RunningConversationEntryModel(conversation, null)));
		this.pastEntries = this.addProperty('pastEntries', new ModelNodeCollection(() => new RunningConversationEntryModel(conversation, null)));

	}

	getTitle() {
		return this.conversation.title.get();
	}

	getDescription() {
		return this.conversation.description.get();
	}

	getPortrait() {
		return this.conversation.portrait.get();
	}
}
