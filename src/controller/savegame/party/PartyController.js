import ControllerNode from "../../basic/ControllerNode";

export default class PartyController extends ControllerNode {

	/**
	 * @type PartyModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.onMainCharacterChangedHandler = () => this.updateMainCharacter();
		this.onPartySlotAdded = (slot) => this.addPartyCharacter(slot);
		this.onPartySlotRemoved = (slot) => this.removePartyCharacter(slot);
	}

	activateInternal() {
		this.updatePartyCharacters();
		this.model.mainCharacterId.addOnChangeListener(this.onMainCharacterChangedHandler);
		this.model.slots.addOnAddListener(this.onPartySlotAdded);
		this.model.slots.addOnAddListener(this.onPartySlotRemoved);
	}

	deactivateInternal() {
		this.model.mainCharacterId.removeOnChangeListener(this.onMainCharacterChangedHandler);
		this.model.slots.removeOnAddListener(this.onPartySlotAdded);
		this.model.slots.removeOnAddListener(this.onPartySlotRemoved);
	}

	loadCharacter(id) {
		return this.game.saveGame.get().characters.getById(id);
	}

	updateMainCharacter() {
		if (this.model.characters.contains(this.model.mainCharacter)) {
			this.model.characters.remove(this.model.mainCharacter);
		}
		this.model.mainCharacter = this.loadCharacter(this.model.mainCharacterId.get());
		if (this.model.mainCharacter) {
			this.model.characters.prepend(this.model.mainCharacter);
		}
	}

	updatePartyCharacters() {
		this.model.characters.reset();
		this.model.slots.forEach((slot) => {
			this.addPartyCharacter(slot);
		});
		this.updateMainCharacter();
	}

	addPartyCharacter(slot) {
		const character = this.loadCharacter(slot.characterId.get());
		this.model.characters.add(character);
	}

	removePartyCharacter(slot) {
		const character = this.loadCharacter(slot.characterId.get());
		this.model.characters.remove(character);
	}

}
