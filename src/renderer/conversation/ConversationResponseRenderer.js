import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import MapRenderer from "../MapRenderer";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/savegame/SaveGameModel";
import BattleRenderer from "../BattleRenderer";
import NodeTableRenderer from "../editor/NodeTableRenderer";
import CollectionRenderer from "../basic/CollectionRenderer";
import ConversationLineRenderer from "./ConversationLineRenderer";

export default class ConversationResponseRenderer extends DomRenderer {

	/**
	 * @type RunningConversationEntryModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.container = null;

	}

	activateInternal() {
		this.container = this.addElement('div', 'response');
		this.link = Pixies.createElement(this.container, 'a');
		this.link.innerText = this.model.originalEntry.responseText.get();
		this.link.addEventListener('click', () => {
			this.model.conversation.currentEntry.set(this.model);
		});

		if (this.game.isInDebugMode.get()) {
			this.del = Pixies.createElement(this.container, 'button');
			this.del.innerText = 'del';
			this.del.addEventListener('click', () => {
				if (confirm('Delete response ' + this.model.originalEntry.responseText.get() + '?')) {
					this.model.conversation.currentEntry.get().entries.remove(this.model);
					this.model.conversation.currentEntry.get().originalEntry.entries.remove(this.model.originalEntry);
				}
			});
		}
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
