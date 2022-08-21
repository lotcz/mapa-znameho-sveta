import ModelNode from "../../basic/ModelNode";
import DirtyValue from "../../basic/DirtyValue";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import ConversationLineModel from "./ConversationLineModel";

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

	constructor() {
		super();

		this.responseText = this.addProperty('responseText', new DirtyValue('Response Text'));
		this.lines = this.addProperty('lines', new ModelNodeCollection(() => new ConversationLineModel()));
		this.entries = this.addProperty('entries', new ModelNodeCollection(() => new ConversationEntryModel()));

	}

}
