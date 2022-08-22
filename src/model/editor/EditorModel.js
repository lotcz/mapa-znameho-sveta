import DirtyValue from "../basic/DirtyValue";
import ModelNode from "../basic/ModelNode";

export default class EditorModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	activeOption;

	resourcesOptions;

	mapOptions;

	saveGameOptions;

	constructor() {
		super();

		this.activeOption = this.addProperty('activeOption', new DirtyValue());

		this.resourcesOptions = {
			races: 'Races',
			characterTemplates: 'Character Templates',
			conversations: 'Conversations'
		};

		this.mapOptions = {
			paths: 'Paths',
			locations: 'Locations'
		};

		this.saveGameOptions = {
			characters: 'Characters'
		};

	}

}
