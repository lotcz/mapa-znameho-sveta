import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import MapRenderer from "../MapRenderer";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/savegame/SaveGameModel";
import BattleRenderer from "../BattleRenderer";
import NodeTableRenderer from "../editor/NodeTableRenderer";
import CollectionRenderer from "../basic/CollectionRenderer";
import ConversationLineRenderer from "./ConversationLineRenderer";
import ConversationLineModel from "../../model/resources/conversation/ConversationLineModel";
import RunningConversationLineModel from "../../model/savegame/conversation/RunningConversationLineModel";

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
		this.lines = Pixies.createElement(this.container, 'div', 'lines');
		this.linesRenderer = this.addChild(new CollectionRenderer(this.game, this.model.lines, (model) => new ConversationLineRenderer(this.game, model, this.lines)));

		if (this.game.isInDebugMode.get()) {
			const buttons = Pixies.createElement(this.container, 'div', 'buttons');
			const add = Pixies.createElement(buttons, 'button');
			add.innerText = 'Add Line';
			add.addEventListener('click', () => {
				const newLine = this.model.originalEntry.lines.add(new ConversationLineModel());
				newLine.text.set('line text');
				this.model.lines.add(new RunningConversationLineModel(this.model.conversation, this.model, newLine));
			});
		}
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.resetChildren();
	}

}
