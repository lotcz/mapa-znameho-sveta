import ControllerNode from "../../basic/ControllerNode";

export default class ConversationController extends ControllerNode {

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
		if (this.model.currentEntry.isSet()) {
			const entry = this.model.currentEntry.get();
			entry.entries.forEach((responseEntry) => {
				const slot = this.game.saveGame.get().party.slots.random();
				const ch = this.game.saveGame.get().characters.getById(slot.characterId.get());
				responseEntry.responseCharacter.set(ch);
			});
			entry.lines.forEach((line) => {
				line.portrait.set(this.model.portrait.get());
			});
			this.model.pastEntries.add(entry);
		}
	}

	restartConversation() {
		this.model.pastEntries.reset();
		this.model.currentEntry.set(null);
		this.model.currentEntry.set(this.model.initialEntry);
	}

}