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

		this.addAutoEvent(
			this.model.currentEntry,
			'change',
			() => this.entrySelected(),
			true
		);

		this.addAutoEvent(
			this.model,
			'restart',
			() => this.restartConversation()
		);

		this.addAutoEvent(
			this.saveGame.completedQuests,
			'quest-completed',
			() => this.processResponseAvailable(this.model.initialEntry),
			true
		);

	}

	activateInternal() {
		if (this.model.currentEntry.isEmpty()) {
			this.restartConversation();
		}
	}

	deactivateInternal() {
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

		if (entry.joinsParty.get()) {
			this.saveGame.triggerEvent('character-joins-party', this.model.character.get());
		}

		if (entry.completesStageId.isSet()) {
			this.saveGame.completedQuests.complete(entry.completesStageId.get());
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

	processResponseAvailable(entry) {
		let avail = true;
		if (entry.requiresStageId.isSet()) {
			avail = this.saveGame.completedQuests.isCompleted(entry.requiresStageId.get());
		}
		if (avail && entry.completesStageId.isSet()) {
			avail = !this.saveGame.completedQuests.isCompleted(entry.completesStageId.get());
		}
		if (avail && entry.hiddenByStageId.isSet()) {
			avail = !this.saveGame.completedQuests.isCompleted(entry.hiddenByStageId.get());
		}
		if (avail && entry.requiresItemId.isSet()) {
			avail = this.saveGame.party.hasItem(entry.requiresItemId.get());
		}
		entry.isResponseAvailable.set(avail);
		entry.entries.forEach((responseEntry) => {
			this.processResponseAvailable(responseEntry);
		});
	}

}
