import IdentifiedModelNode from "../basic/IdentifiedModelNode";
import ModelNodeTable from "../basic/ModelNodeTable";
import MaterialModel from "./MaterialModel";
import RaceModel from "../characters/RaceModel";
import MapModel from "./MapModel";
import CharacterModel from "../characters/CharacterModel";
import ConversationModel from "./conversation/ConversationModel";

export default class ResourcesModel extends IdentifiedModelNode {

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
	conversations;

	constructor(id) {
		super(id);

		this.map = this.addProperty('map', new MapModel());
		this.materials = this.addProperty('materials', new ModelNodeTable((id) => new MaterialModel(id)));
		this.races = this.addProperty('races', new ModelNodeTable((id) => new RaceModel(id)));
		this.characters = this.addProperty('characters', new ModelNodeTable((id) => new CharacterModel(id)));
		this.conversations = this.addProperty('conversations', new ModelNodeTable((id) => new ConversationModel(id)));

	}

}
