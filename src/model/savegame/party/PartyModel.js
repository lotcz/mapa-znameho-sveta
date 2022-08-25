import ModelNode from "../../basic/ModelNode";
import CharacterModel from "../../characters/CharacterModel";
import DirtyValue from "../../basic/DirtyValue";

export default class PartyModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	mainCharacterId;

	/**
	 * @type CharacterModel
	 */
	mainCharacter;

	constructor() {
		super();

		this.mainCharacterId = this.addProperty('mainCharacterId', new DirtyValue(0));
		this.mainCharacterId.addOnChangeListener(() => this.autoHydrate());

		this.mainCharacter = null;


	}

	hydrateInternal(game) {
		this.mainCharacter = game.saveGame.get().characters.getById(this.mainCharacterId.get());
	}

}
