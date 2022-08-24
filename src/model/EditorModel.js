import ModelNode from "./basic/ModelNode";
import NullableNode from "./basic/NullableNode";

export default class EditorModel extends ModelNode {

	/**
	 * @type NullableNode
	 */
	activeTable;

	/**
	 * @type NullableNode
	 */
	activeForm;

	resourcesOptions;

	mapOptions;

	saveGameOptions;

	constructor() {
		super();

		this.activeTable = new NullableNode();
		this.activeForm = new NullableNode();

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
