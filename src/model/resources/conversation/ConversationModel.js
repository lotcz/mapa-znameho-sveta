import DirtyValue from "../../basic/DirtyValue";
import ConversationEntryModel from "./ConversationEntryModel";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import CharacterModel from "../../characters/CharacterModel";
import NullableNode from "../../basic/NullableNode";

export default class ConversationModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	title;

	/**
	 * @type DirtyValue
	 */
	description;

	/**
	 * @type DirtyValue
	 */
	portrait;

	/**
	 * @type DirtyValue
	 */
	characterId;

	/**
	 * @type ConversationEntryModel
	 */
	initialEntry;

	/**
	 * @type NullableNode
	 */
	currentEntry;

	/**
	 * @type ModelNodeCollection
	 */
	pastEntries;

	/**
	 * @type NullableNode
	 */
	character;

	constructor(id) {
		super(id);

		this.title = this.addProperty('title', new DirtyValue('Conversation'));
		this.description = this.addProperty('description', new DirtyValue('Conversation description'));
		this.portrait = this.addProperty('portrait', new DirtyValue('img/portrait/adelan/female-1.jpg'));
		this.characterId = this.addProperty('characterId', new DirtyValue());
		this.initialEntry = this.addProperty('initialEntry', new ConversationEntryModel());

		this.currentEntry = new NullableNode(() => new ConversationEntryModel());
		this.pastEntries = new ModelNodeCollection(() => new ConversationEntryModel());
		this.character = new NullableNode(() => new CharacterModel());
	}

}
