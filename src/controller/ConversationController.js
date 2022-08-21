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

		this.onEntrySelected = (p) => this.entrySelected(p.oldValue, p.newValue);
	}

	activateInternal() {
		this.model.currentEntry.addOnChangeListener(this.onEntrySelected);
		if (this.model.currentEntry.isEmpty()) {
			this.model.currentEntry.set(new RunningConversationEntryModel(this.model, this.model.conversation.initialEntry));
		}
	}

	deactivateInternal() {
		this.model.currentEntry.removeOnChangeListener(this.onEntrySelected);
	}

	entrySelected(oldval, newval) {
		if (oldval) {
			this.model.pastEntries.add(oldval);
		}
		if (!this.model.currentEntry.isEmpty()) {
			const entry = this.model.currentEntry.get();
			entry.entries.reset();
			entry.originalEntry.entries.forEach((e) => {
				const character = this.game.resources.characters.getById(1);
				console.log(character);
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

}
