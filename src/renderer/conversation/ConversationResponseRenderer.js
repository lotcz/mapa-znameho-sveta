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
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
