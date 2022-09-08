import ModelNode from "../../basic/ModelNode";
import DirtyValue from "../../basic/DirtyValue";

export default class ConversationLineModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	text;

	/**
	 * @type DirtyValue
	 */
	portrait;

	/**
	 * @type DirtyValue
	 */
	isNarrator;

	/**
	 * @type DirtyValue
	 */
	isResponse;

	constructor() {
		super();

		this.text = this.addProperty('responseText', new DirtyValue('text'));
		this.portrait = this.addProperty('portrait', new DirtyValue(null, false));
		this.isNarrator = this.addProperty('isNarrator', new DirtyValue(false));

		this.isResponse = new DirtyValue(false);
	}

}
