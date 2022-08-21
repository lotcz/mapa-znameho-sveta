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

	constructor() {
		super();

		this.text = this.addProperty('responseText', new DirtyValue('text'));
		this.portrait = this.addProperty('portrait', new DirtyValue());

	}

}
