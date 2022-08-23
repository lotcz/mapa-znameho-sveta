import ModelNode from "../../basic/ModelNode";
import DirtyValue from "../../basic/DirtyValue";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import ConversationLineModel from "./ConversationLineModel";
import CharacterModel from "../../characters/CharacterModel";
import NullableNode from "../../basic/NullableNode";

export default class ConversationEntryModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	responseText;

	/**
	 * @type ModelNodeCollection
	 */
	lines;

	/**
	 * @type ModelNodeCollection
	 */
	entries;

	/**
	 * @type DirtyValue
	 */
	isResponseAvailable;

	/**
	 * @type NullableNode
	 */
	responseCharacter;

	constructor() {
		super();

		this.responseText = this.addProperty('responseText', new DirtyValue('Response Text'));
		this.lines = this.addProperty('lines', new ModelNodeCollection(() => new ConversationLineModel()));
		this.entries = this.addProperty('entries', new ModelNodeCollection(() => new ConversationEntryModel()));

		this.isResponseAvailable = new DirtyValue(true);
		this.responseCharacter = new NullableNode(() => new CharacterModel());
	}

}
