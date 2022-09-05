import ModelNode from "../basic/ModelNode";
import NullableNode from "../basic/NullableNode";

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

		this.activeTable = this.addProperty('activeTable', new NullableNode());
		this.activeForm = this.addProperty('activeForm', new NullableNode());

		this.resourcesOptions = {
			materials: 'Materials',
			models3d: '3D Models',
			races: 'Races',
			characterTemplates: 'Character Templates',
			conversations: 'Conversations'
		};

		this.mapOptions = {
			biotopes: 'Biotopes',
			paths: 'Paths',
			locations: 'Locations',
			battleMaps: 'Battle Maps',
		};

		this.saveGameOptions = {
			characters: 'Characters',
			slots: 'Party Slots'
		};

	}

}
