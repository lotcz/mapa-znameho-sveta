import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import MapRenderer from "../MapRenderer";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/savegame/SaveGameModel";
import BattleRenderer from "../BattleRenderer";
import NodeTableRenderer from "../editor/NodeTableRenderer";
import CollectionRenderer from "../basic/CollectionRenderer";
import ConversationEntryRenderer from "./ConversationEntryRenderer";
import ConversationResponseRenderer from "./ConversationResponseRenderer";
import ConversationEntryModel from "../../model/resources/conversation/ConversationEntryModel";
import RunningConversationEntryModel from "../../model/savegame/conversation/RunningConversationEntryModel";

export default class ConversationRenderer extends DomRenderer {

	/**
	 * @type RunningConversationModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.container = null;

		this.entriesRenderer = null;
		this.responsesRenderer = null;

		this.onCurrentEntryChanged = () => this.updateResponses();
	}

	activateInternal() {
		this.container = this.addElement('div', 'conversation');
		this.container.addEventListener('mousemove', (e) => e.stopPropagation());
		this.container.addEventListener('click', (e) => e.stopPropagation());

		this.inner = Pixies.createElement(this.container, 'div', 'inner');

		this.header = Pixies.createElement(this.inner, 'div', 'header');
		const title = Pixies.createElement(this.header, 'div', 'title');
		title.innerText = this.model.getTitle();

		const info = Pixies.createElement(this.header, 'div', 'info');

		const portraitUrl = this.model.getPortrait();
		if (portraitUrl) {
			this.portrait = Pixies.createElement(info, 'div', 'portrait');
			this.game.assets.getAsset(portraitUrl, (image) => {
				this.portrait.appendChild(image);
			});
		}

		const description = Pixies.createElement(info, 'div', 'description');
		description.innerText = this.model.getDescription();

		this.entries = Pixies.createElement(this.inner, 'div', 'entries');
		this.entriesRenderer = new CollectionRenderer(this.game, this.model.pastEntries, (model) => new ConversationEntryRenderer(this.game, model, this.entries));
		this.addChild(this.entriesRenderer);

		this.responses = Pixies.createElement(this.inner, 'div', 'responses');
		if (this.game.isInDebugMode.get()) {
			const buttons = Pixies.createElement(this.responses, 'div', 'buttons');
			const add = Pixies.createElement(buttons, 'button');
			add.innerText = 'Add';
			add.addEventListener('click', () => {
				const currentEntry = this.model.currentEntry.get();
				const newEntry = currentEntry.originalEntry.entries.add(new ConversationEntryModel());
				currentEntry.entries.add(new RunningConversationEntryModel(this.model, newEntry));
			});
		}
		this.updateResponses();
		this.model.currentEntry.addOnChangeListener(this.onCurrentEntryChanged);

	}

	deactivateInternal() {
		this.model.currentEntry.removeOnChangeListener(this.onCurrentEntryChanged);
		this.resetChildren();
		this.removeElement(this.container);
	}

	updateResponses() {
		if (this.responsesRenderer) {
			this.removeChild(this.responsesRenderer);
		}
		const currentEntry = this.model.currentEntry.get();
		if (currentEntry) {
			this.responsesRenderer = new CollectionRenderer(this.game, currentEntry.entries, (model) => new ConversationResponseRenderer(this.game, model, this.responses));
			this.addChild(this.responsesRenderer);
		}
	}
}
