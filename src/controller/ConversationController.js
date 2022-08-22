import ControllerNode from "./basic/ControllerNode";
import RunningConversationEntryModel from "../model/savegame/conversation/RunningConversationEntryModel";
import RunningConversationLineModel from "../model/savegame/conversation/RunningConversationLineModel";
import ConversationLineModel from "../model/resources/conversation/ConversationLineModel";

export default class ConversationController extends ControllerNode {

	/**
	 * @type RunningConversationModel
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
		if (this.model.currentEntry.isEmpty()) {
			this.restartConversation();
		}
		this.model.addEventListener('restart', this.onRestart);
	}

	deactivateInternal() {
		this.model.currentEntry.removeOnChangeListener(this.onEntrySelected);
		this.model.removeEventListener('restart', this.onRestart);
	}

	entrySelected() {
		if (this.model.currentEntry.isSet()) {
			this.model.pastEntries.add(this.model.currentEntry.get());
			const entry = this.model.currentEntry.get();
			entry.entries.reset();
			entry.originalEntry.entries.forEach((e) => {
				const character = this.game.resources.characters.getById(1);
				const runningEntry = entry.entries.add(new RunningConversationEntryModel(this.model, e, character));
			});
			entry.lines.reset();
			const line = new ConversationLineModel();
			line.text.set(entry.originalEntry.responseText.get());
			entry.lines.add(new RunningConversationLineModel(this.model, entry, line, true));
			entry.originalEntry.lines.forEach((l) => {
				entry.lines.add(new RunningConversationLineModel(this.model, entry, l, false));
			});
		}
	}

	restartConversation() {
		this.model.pastEntries.reset();
		this.model.currentEntry.set(new RunningConversationEntryModel(this.model, this.model.conversation.initialEntry));
	}

}
