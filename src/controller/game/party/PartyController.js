import CollectionController from "../../basic/CollectionController";
import PartySlotController from "./PartySlotController";
import ControllerWithSaveGame from "../../basic/ControllerWithSaveGame";

export default class PartyController extends ControllerWithSaveGame {

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
			this.model.selectedCharacterId,
			'change',
			() => {
				this.model.selectedCharacter.set(this.saveGame.characters.getById(this.model.selectedCharacterId.get()));
			},
			true
		);

		this.addAutoEvent(
			this.model,
			'character-selected',
			(id) => {
				if (this.model.selectedCharacterId.equalsTo(id)) {
					this.model.isInventoryVisible.invert();
					return;
				}
				this.model.selectedCharacterId.set(id);
			}
		);

	}

}
