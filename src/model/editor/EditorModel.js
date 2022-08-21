import DirtyValue from "../basic/DirtyValue";
import ModelNode from "../basic/ModelNode";

export default class EditorModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	activeOption;

	menuOptions;

	constructor() {
		super();

		this.activeOption = this.addProperty('activeOption', new DirtyValue());

		this.menuOptions = {
			races: 'Races',
			characters: 'Characters',
			conversations: 'Conversations'
		};

	}

}
