import ModelNode from "../../basic/ModelNode";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import ConversationLineModel from "./ConversationLineModel";
import NullableNode from "../../basic/NullableNode";
import IntValue from "../../basic/IntValue";
import BoolValue from "../../basic/BoolValue";
import StringValue from "../../basic/StringValue";

export default class ConversationEntryModel extends ModelNode {

	/**
	 * @type StringValue
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
	requiresItemId;

	/**
	 * @type IntValue
	 */
	completesStageId;

	/**
	 * @type IntValue
	 */
	hiddenByStageId;

	/**
	 * @type BoolValue
	 */
	joinsParty;

	/**
	 * @type BoolValue
	 */
	isExitAvailable;

	/**
	 * @type IntValue
	 */
	showParentResponses;

	/**
	 * @type BoolValue
	 */
	isResponseAvailable;

	/**
	 * @type NullableNode<CharacterModel>
	 */
	responseCharacter;

	/**
	 * @type NullableNode<ConversationEntryModel>
	 */
	parentEntry;

	constructor() {
		super();

		this.responseText = this.addProperty('responseText', new StringValue());
		this.lines = this.addProperty('lines', new ModelNodeCollection(() => new ConversationLineModel()));
		this.entries = this.addProperty('entries', new ModelNodeCollection(() => new ConversationEntryModel()));

		this.requiresStageId = this.addProperty('requiresStageId', new IntValue());
		this.completesStageId = this.addProperty('completesStageId', new IntValue());
		this.hiddenByStageId = this.addProperty('hiddenByStageId', new IntValue());

		this.requiresItemId = this.addProperty('requiresItemId', new IntValue());
		this.givesItemId = this.addProperty('givesItemId', new IntValue());

		this.joinsParty = this.addProperty('joinsParty', new BoolValue(false));

		this.isExitAvailable = this.addProperty('isExitAvailable', new BoolValue(true));
		this.showParentResponses = this.addProperty('showParentResponses', new IntValue(0));

		this.isResponseAvailable = new BoolValue(true, false);
		this.responseCharacter = new NullableNode(null, false);
		this.parentEntry = new NullableNode(null, false);
	}

}
