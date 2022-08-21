import DirtyValue from "../../basic/DirtyValue";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import ConversationEntryModel from "./ConversationEntryModel";

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

	constructor(id) {
		super(id);

		this.title = this.addProperty('title', new DirtyValue('Conversation'));
		this.description = this.addProperty('description', new DirtyValue('Conversation description'));
		this.portrait = this.addProperty('portrait', new DirtyValue('img/portrait/adelan/female-1.jpg'));
		this.characterId = this.addProperty('characterId', new DirtyValue());
		this.initialEntry = this.addProperty('initialEntry', new ConversationEntryModel());

	}


}
