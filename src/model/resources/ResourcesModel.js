import ModelNodeTable from "../basic/ModelNodeTable";
import MaterialModel from "./3d/MaterialModel";
import RaceModel from "./characters/RaceModel";
import MapModel from "./map/MapModel";
import CharacterModel from "./characters/CharacterModel";
import ConversationModel from "./conversation/ConversationModel";
import ModelNode from "../basic/ModelNode";
import Model3dModel from "./3d/Model3dModel";

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
	models3d;

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
		this.models3d = this.addProperty('models3d', new ModelNodeTable((id) => new Model3dModel(id)));
		this.races = this.addProperty('races', new ModelNodeTable((id) => new RaceModel(id)));
		this.characterTemplates = this.addProperty('characterTemplates', new ModelNodeTable((id) => new CharacterModel(id)));
		this.conversations = this.addProperty('conversations', new ModelNodeTable((id) => new ConversationModel(id)));

	}

}
