import ModelNodeTable from "../basic/ModelNodeTable";
import MaterialModel from "./items/MaterialModel";
import RaceModel from "./party/characters/RaceModel";
import MapModel from "./map/MapModel";
import CharacterModel from "./party/characters/CharacterModel";
import ConversationModel from "./conversation/ConversationModel";
import ModelNode from "../basic/ModelNode";
import Model3dModel from "./items/Model3dModel";
import ItemDefinitionModel from "./items/ItemDefinitionModel";
import SpriteModel from "./battle/SpriteModel";
import Sprite3dModel from "./battle/Sprite3dModel";

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
	sprites;

	/**
	 * @type ModelNodeTable<Model3dModel>
	 */
	models3d;

	/**
	 * @type ModelNodeTable
	 */
	sprites3d;

	/**
	 * @type ModelNodeTable
	 */
	races;

	/**
	 * @type ModelNodeTable
	 */
	characterTemplates;

	/**
	 * @type ModelNodeTable<ItemModel>
	 */
	itemDefinitions;

	/**
	 * @type ModelNodeTable
	 */
	conversations;

	constructor() {
		super();

		this.map = this.addProperty('map', new MapModel());
		this.materials = this.addProperty('materials', new ModelNodeTable((id) => new MaterialModel(id)));
		this.sprites = this.addProperty('sprites', new ModelNodeTable((id) => new SpriteModel(id)));
		this.models3d = this.addProperty('models3d', new ModelNodeTable((id) => new Model3dModel(id)));
		this.sprites3d = this.addProperty('sprites3d', new ModelNodeTable((id) => new Sprite3dModel(id)));
		this.races = this.addProperty('races', new ModelNodeTable((id) => new RaceModel(id)));
		this.characterTemplates = this.addProperty('characterTemplates', new ModelNodeTable((id) => new CharacterModel(id)));
		this.conversations = this.addProperty('conversations', new ModelNodeTable((id) => new ConversationModel(id)));
		this.itemDefinitions = this.addProperty('itemDefinitions', new ModelNodeTable((id) => new ItemDefinitionModel(id)));
	}

}
