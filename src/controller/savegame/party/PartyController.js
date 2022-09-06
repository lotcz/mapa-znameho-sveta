import ControllerNode from "../../basic/ControllerNode";
import CollectionController from "../../basic/CollectionController";
import PartySlotController from "./PartySlotController";

export default class PartyController extends ControllerNode {

	/**
	 * @type PartyModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.slotsController = new CollectionController(this.game, this.model.slots, (m) => new PartySlotController(this.game, m));
		this.addChild(this.slotsController);

		this.addAutoEvent(
			this.model.mainCharacterId,
			'change',
			() => {
				this.model.mainCharacter.set(this.game.saveGame.get().characters.getById(this.model.mainCharacterId.get()));
			},
			true
		);

		this.addAutoEvent(
			this.model.selectedCharacterId,
			'change',
			() => {
				this.model.selectedCharacter.set(this.game.saveGame.get().characters.getById(this.model.selectedCharacterId.get()));
			},
			true
		);

		this.addAutoEvent(
			this.model,
			'character-selected',
			(id) => {
				this.model.selectedCharacterId.set(id);
			},
			true
		);
	}

}
