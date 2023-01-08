import ModelNode from "../../basic/ModelNode";
import DirtyValue from "../../basic/DirtyValue";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import ConversationLineModel from "./ConversationLineModel";
import NullableNode from "../../basic/NullableNode";
import IntValue from "../../basic/IntValue";

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
	 * @type IntValue
	 */
	requiresStageId;

	/**
	 * @type IntValue
	 */
	completesStageId;

	/**
	 * @type DirtyValue
	 */
	isResponseAvailable;

	/**
	 * @type NullableNode<CharacterModel>
	 */
	responseCharacter;

	constructor() {
		super();

		this.responseText = this.addProperty('responseText', new DirtyValue('Response Text'));
		this.lines = this.addProperty('lines', new ModelNodeCollection(() => new ConversationLineModel()));
		this.entries = this.addProperty('entries', new ModelNodeCollection(() => new ConversationEntryModel()));

		this.requiresStageId = this.addProperty('requiresStageId', new IntValue());
		this.completesStageId = this.addProperty('completesStageId', new IntValue());

		this.isResponseAvailable = new DirtyValue(true, false);
		this.responseCharacter = new NullableNode(null, false);
	}

}
