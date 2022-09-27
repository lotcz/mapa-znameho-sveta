import ModelNode from "../basic/ModelNode";
import NullableNode from "../basic/NullableNode";
import BoolValue from "../basic/BoolValue";
import BattleEditorModel from "./BattleEditorModel";

export default class EditorModel extends ModelNode {

	/**
	 * @type NullableNode
	 */
	activeTable;

	/**
	 * @type NullableNode
	 */
	activeForm;

	/**
	 * @type NullableNode<ItemDefinitionModel>
	 */
	activeItemImageDefinition;

	/**
	 * @type NullableNode<ItemDefinitionModel>
	 */
	activeItemMounting;

	/**
	 * @type NullableNode<MaterialModel>
	 */
	activeMaterial;

	/**
	 * @type BattleEditorModel
	 */
	battleEditor;

	/**
	 * @type BoolValue
	 */
	isOptionsVisible;

	resourcesOptions;

	mapOptions;

	saveGameOptions;

	constructor() {
		super();

		this.activeTable = this.addProperty('activeTable', new NullableNode());
		this.activeForm = this.addProperty('activeForm', new NullableNode());
		this.activeItemImageDefinition = this.addProperty('activeItemDefinition', new NullableNode());
		this.activeItemMounting = this.addProperty('activeItemMounting', new NullableNode());
		this.activeMaterial = this.addProperty('activeMaterial', new NullableNode());
		this.battleEditor = this.addProperty('battleEditor', new BattleEditorModel());

		this.isOptionsVisible = this.addProperty('isOptionsVisible', new BoolValue(true));

		this.resourcesOptions = {
			materials: 'Materials',
			sprites: 'Sprites',
			models3d: '3D Models',
			sprites3d: '3D Sprites',
			races: 'Races',
			characterTemplates: 'Character Templates',
			conversations: 'Conversations',
			itemDefinitions: 'Item Definitions',
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
