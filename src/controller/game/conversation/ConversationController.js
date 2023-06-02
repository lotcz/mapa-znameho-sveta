import ControllerWithSaveGame from "../../basic/ControllerWithSaveGame";
import ItemModel from "../../../model/game/items/ItemModel";

export default class ConversationController extends ControllerWithSaveGame {

	/**
	 * @type ConversationModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.onEntrySelected = () => this.entrySelected();
		this.onRestart = () => this.restartConversation();
	}

	activateInternal() {
		this.model.currentEntry.addOnChangeListener(this.onEntrySelected);
		if (this.model.character.isEmpty() && this.model.characterId.isSet()) {
			this.model.character.set(this.game.resources.characterTemplates.getById(this.model.characterId.get()));
		}
		if (this.model.currentEntry.isEmpty()) {
			this.restartConversation();
		}
		this.model.addEventListener('restart', this.onRestart);
	}

	deactivateInternal() {
		this.model.currentEntry.removeOnChangeListener(this.onEntrySelected);
		this.model.removeEventListener('restart', this.onRestart);
		this.model.currentEntry.set(null);
	}

	entrySelected() {
		if (this.model.currentEntry.isEmpty()) {
			return;
		}

		/** @type ConversationEntryModel */
		const entry = this.model.currentEntry.get();

		/** @type CharacterModel */
		const character = this.saveGame.party.selectedCharacter.get();

		entry.responseCharacter.set(character);

		if (entry.completesStageId.isSet()) {
			this.saveGame.completedStages.complete(entry.completesStageId.get());
		}

		if (entry.givesItemId.isSet()) {
			const item = new ItemModel();
			item.definitionId.set(entry.givesItemId.get());
			this.saveGame.triggerEvent('drop-selected-item');
			this.saveGame.selectedItemSlot.item.set(item);
		}

		entry.lines.forEach((line) => {
			line.portrait.set(this.model.portrait.get());
		});

		this.model.pastEntries.add(entry);
	}

	updateEntryParents(entry = null, parent = null) {
		if (!entry) {
			entry = this.model.currentEntry.get();
		}
		if (parent) {
			entry.parentEntry.set(parent);
		}
		entry.entries.forEach((e) => this.updateEntryParents(e, entry));
	}

	restartConversation() {
		this.model.pastEntries.reset();
		this.model.currentEntry.set(null);
		this.model.currentEntry.set(this.model.initialEntry);
		this.updateEntryParents();
	}

}
