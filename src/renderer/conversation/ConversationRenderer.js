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
import ConversationLineModel from "../../model/resources/conversation/ConversationLineModel";
import RunningConversationLineModel from "../../model/savegame/conversation/RunningConversationLineModel";

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
		this.container.addEventListener('wheel', (e) => e.stopPropagation());

		this.inner = Pixies.createElement(this.container, 'div', 'inner');
		const scroll = this.scroll = Pixies.createElement(this.inner, 'div', 'scroll');

		const header = Pixies.createElement(scroll, 'div', 'header');
		const title = Pixies.createElement(header, 'h2', 'title');
		title.innerText = this.model.getTitle();

		const info = Pixies.createElement(header, 'div', 'info');

		const portraitUrl = this.model.getPortrait();
		if (portraitUrl) {
			this.portrait = Pixies.createElement(info, 'div', 'portrait');
			this.game.assets.getAsset(portraitUrl, (image) => {
				this.portrait.appendChild(image);
			});
		}

		const description = Pixies.createElement(info, 'div', 'description');
		description.innerText = this.model.getDescription();

		if (this.game.isInDebugMode.get()) {
			Pixies.magicEditor(title, (value) => this.model.conversation.title.set(value));
			Pixies.magicEditor(description, (value) => this.model.conversation.description.set(value), true);

			const buttons = Pixies.createElement(info, 'div', 'buttons');
			const restart = Pixies.createElement(buttons, 'button');
			restart.innerText = 'Restart';
			restart.addEventListener('click', () => {
				this.model.triggerEvent('restart');
			});
			const close = Pixies.createElement(buttons, 'button');
			close.innerText = 'Close';
			close.addEventListener('click', () => {
				this.game.saveGame.runningConversation.set(null);
			});
		}

		this.entries = Pixies.createElement(scroll, 'div', 'entries');
		this.entriesRenderer = new CollectionRenderer(this.game, this.model.pastEntries, (model) => new ConversationEntryRenderer(this.game, model, this.entries));
		this.addChild(this.entriesRenderer);

		this.currentEntry = Pixies.createElement(scroll, 'div', 'current-entry');
		if (this.game.isInDebugMode.get()) {
			const buttons = Pixies.createElement(scroll, 'div', 'buttons');
			const add = Pixies.createElement(buttons, 'button');
			add.innerText = 'Add Line';
			add.addEventListener('click', () => {
				const currentEntry = this.model.currentEntry.get();
				const newLine = currentEntry.originalEntry.lines.add(new ConversationLineModel());
				newLine.text.set('line text');
				currentEntry.lines.add(new RunningConversationLineModel(this.model, currentEntry, newLine));
			});
		}

		this.responses = Pixies.createElement(scroll, 'div', 'responses');
		if (this.game.isInDebugMode.get()) {
			const buttons = Pixies.createElement(this.scroll, 'div', 'buttons');
			const add = Pixies.createElement(buttons, 'button');
			add.innerText = 'Add Response';
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
		if (this.currentEntryRenderer) {
			this.removeChild(this.currentEntryRenderer);
		}
		const currentEntry = this.model.currentEntry.get();
		if (currentEntry) {
			this.responsesRenderer = new CollectionRenderer(this.game, currentEntry.entries, (model) => new ConversationResponseRenderer(this.game, model, this.responses));
			this.addChild(this.responsesRenderer);
			this.currentEntryRenderer = new ConversationEntryRenderer(this.game, currentEntry, this.currentEntry);
			this.addChild(this.currentEntryRenderer);
		}

	}
}
