import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import CollectionRenderer from "../basic/CollectionRenderer";
import ConversationEntryRenderer from "./ConversationEntryRenderer";
import ConversationResponseRenderer from "./ConversationResponseRenderer";
import ConversationEntryModel from "../../model/resources/conversation/ConversationEntryModel";
import RunningConversationEntryModel from "../../model/savegame/conversation/RunningConversationEntryModel";
import AnimatedValue from "../../class/animating/AnimatedValue";

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

		this.scrollLastTime = 0;
		this.scrollAnimation = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'conversation');
		this.container.addEventListener('mousemove', (e) => e.stopPropagation());
		this.container.addEventListener('click', (e) => e.stopPropagation());
		this.container.addEventListener('wheel', (e) => e.stopPropagation());

		this.panel = Pixies.createElement(this.container, 'div', 'panel');
		this.inner = Pixies.createElement(this.panel, 'div', 'inner');

		const header = Pixies.createElement(this.inner, 'div', 'header');
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

			const buttons = Pixies.createElement(info, 'div');
			const back = Pixies.createElement(buttons, 'button');
			back.innerText = 'Back';
			back.addEventListener('click', () => {
				const current = this.model.pastEntries.children.removeLast();
				const prev = this.model.pastEntries.children.removeLast();
				if (prev) {
					this.model.currentEntry.set(prev);
				}
			});
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

		this.entries = Pixies.createElement(this.inner, 'div', ['entries', 'scroll']);
		this.entriesRenderer = new CollectionRenderer(this.game, this.model.pastEntries, (model) => new ConversationEntryRenderer(this.game, model, this.entries));
		this.addChild(this.entriesRenderer);

		this.responses = Pixies.createElement(this.inner, 'div', ['responses', 'scroll']);
		if (this.game.isInDebugMode.get()) {
			const buttons = Pixies.createElement(this.inner, 'div', 'buttons');
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

		this.scrollDown();
	}

	scrollDown() {
		let scrollLastTime = performance.now();
		const scrollAnimation = new AnimatedValue(this.entries.scrollTop, this.entries.scrollHeight, 5000);
		const timer = setInterval(
			() => {
				const time = performance.now();
				const delta = time - scrollLastTime;
				this.entries.scrollTop = scrollAnimation.get(delta);
				console.log(this.entries.scrollTop);
				scrollLastTime = time;
				if (scrollAnimation.isFinished()) {
					clearInterval(timer);
				}
			},
		150
		);
	}
}
