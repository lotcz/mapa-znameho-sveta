import ModelNodeCollection from "../../basic/ModelNodeCollection";
import RunningConversationLineModel from "./RunningConversationLineModel";
import ModelNode from "../../basic/ModelNode";
import DirtyValue from "../../basic/DirtyValue";

export default class RunningConversationEntryModel extends ModelNode {

	/**
	 * @type RunningConversationModel
	 */
	conversation;

	/**
	 * @type ConversationEntryModel
	 */
	originalEntry;

	/**
	 * @type ModelNodeCollection
	 */
	entries;

	/**
	 * @type DirtyValue
	 */
	responseAvailable;

	/**
	 * @type CharacterModel
	 */
	characterResponding;

	/**
	 * @type ModelNodeCollection
	 */
	lines;

	constructor(conversation, entry, character) {
		super();

		this.conversation = conversation;
		this.originalEntry = entry;
		this.responseAvailable = new DirtyValue(true);
		this.characterResponding = character;
		this.lines = new ModelNodeCollection(() => new RunningConversationLineModel());
		this.entries = new ModelNodeCollection(() => new RunningConversationEntryModel());
	}

}
