import DirtyValue from "../../basic/DirtyValue";
import ConversationEntryModel from "./ConversationEntryModel";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import CharacterModel from "../party/characters/CharacterModel";
import NullableNode from "../../basic/NullableNode";
import IntValue from "../../basic/IntValue";

export default class ConversationModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 */
	description;

	/**
	 * @type DirtyValue
	 */
	portrait;

	/**
	 * @type IntValue
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

		this.name = this.addProperty('name', new DirtyValue(`Conversation ${id}`));
		this.description = this.addProperty('description', new DirtyValue('Conversation description'));
		this.portrait = this.addProperty('portrait', new DirtyValue('img/portrait/adelan/female-1.jpg'));
		this.characterId = this.addProperty('characterId', new IntValue(0));
		this.character = this.addProperty('character', new NullableNode(() => new CharacterModel(), false));

		this.initialEntry = this.addProperty('initialEntry', new ConversationEntryModel());

		this.currentEntry = this.addProperty('currentEntry', new NullableNode(() => new ConversationEntryModel(), false));
		this.pastEntries = this.addProperty('pastEntries', new ModelNodeCollection(() => new ConversationEntryModel(), false));

	}

}
