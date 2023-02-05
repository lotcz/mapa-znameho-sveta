import NullableNodeController from "../../basic/NullableNodeController";
import CharacterController from "./CharacterController";
import ControllerWithSaveGame from "../../basic/ControllerWithSaveGame";

export default class PartySlotController extends ControllerWithSaveGame {

	/**
	 * @type PartySlotModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.character,
				(m) => new CharacterController(this.game, m)
			)
		);

		this.addAutoEvent(this.model.characterId, 'change', () => this.updateCharacter(), true);
	}

	updateCharacter() {
		const character = this.saveGame.characters.getById(this.model.characterId.get());
		if (character) {
			this.model.character.set(character);
		} else {
			this.model.character.set(null);
			console.log('character not found', this.model.characterId.get());
		}
	}

}
