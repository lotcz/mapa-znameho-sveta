import ModelNodeTable from "../basic/ModelNodeTable";
import MaterialModel from "./MaterialModel";
import RaceModel from "../characters/RaceModel";
import MapModel from "./MapModel";
import CharacterModel from "../characters/CharacterModel";
import ConversationModel from "./conversation/ConversationModel";
import ModelNode from "../basic/ModelNode";

export default class ResourcesModel extends ModelNode {

	/**
	 * @type MapModel
	 */
	map;

	/**
	 * @type ModelNodeTable
	 */
	materials;

	/**
	 * @type ModelNodeTable
	 */
	races;

	/**
	 * @type ModelNodeTable
	 */
	characterTemplates;

	/**
	 * @type ModelNodeTable
	 */
	conversations;

	constructor() {
		super();

		this.map = this.addProperty('map', new MapModel());
		this.materials = this.addProperty('materials', new ModelNodeTable((id) => new MaterialModel(id)));
		this.races = this.addProperty('races', new ModelNodeTable((id) => new RaceModel(id)));
		this.characterTemplates = this.addProperty('characterTemplates', new ModelNodeTable((id) => new CharacterModel(id)));
		this.conversations = this.addProperty('conversations', new ModelNodeTable((id) => new ConversationModel(id)));

	}

}
