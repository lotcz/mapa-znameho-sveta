import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import MapRenderer from "../MapRenderer";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/savegame/SaveGameModel";
import BattleRenderer from "../BattleRenderer";
import NodeTableRenderer from "../editor/NodeTableRenderer";
import CollectionRenderer from "../basic/CollectionRenderer";
import ConversationLineRenderer from "./ConversationLineRenderer";

export default class ConversationEntryRenderer extends DomRenderer {

	/**
	 * @type RunningConversationEntryModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.container = null;

		this.linesRenderer = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'entry');
		this.linesRenderer = this.addChild(new CollectionRenderer(this.game, this.model.lines, (model) => new ConversationLineRenderer(this.game, model, this.container)));
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.resetChildren();
	}

}
