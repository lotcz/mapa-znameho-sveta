import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";
import CollectionRenderer from "../../basic/CollectionRenderer";
import ConversationEntryRenderer from "./ConversationEntryRenderer";
import ConversationResponseRenderer from "./ConversationResponseRenderer";
import ConversationEntryModel from "../../../model/game/conversation/ConversationEntryModel";
import AnimatedValue from "../../../class/animating/AnimatedValue";

export default class ConversationRenderer extends DomRenderer {

	/**
	 * @type ConversationModel
	 */
	model;

	constructor(game, model, dom, saveGame) {
		super(game, model, dom);

		this.model = model;
		this.saveGame = saveGame;

		this.container = null;

		this.entriesRenderer = null;
		this.responsesRenderer = null;

		this.scrollTimer = null;
		this.onCurrentEntryChanged = () => this.updateResponses();
		this.onContainerEvent = (e) => e.stopPropagation();
		this.onScroll = (e) => {
			e.stopPropagation();
			this.clearTimer();
		};
	}

	activateInternal() {
		Pixies.addClass(this.dom, 'container');

		this.container = this.addElement('div', 'conversation container container-host');
		this.container.addEventListener('mousemove', this.onContainerEvent);
		this.container.addEventListener('click', this.onContainerEvent);
		this.container.addEventListener('wheel', this.onContainerEvent);

		this.overlay = Pixies.createElement(this.container, 'div', 'overlay container');

		this.panelWrapper = Pixies.createElement(this.container, 'div', 'container column center p-3');
		this.panel = Pixies.createElement(this.panelWrapper, 'div', 'panel paper left');
		this.inner = Pixies.createElement(this.panel, 'div', 'inner');

		const header = Pixies.createElement(this.inner, 'div', 'header');
		const title = Pixies.createElement(header, 'div', 'row');
		const titleText = Pixies.createElement(title, 'h2', 'title');
		titleText.innerText = this.model.name.get();

		const info = Pixies.createElement(header, 'div', 'info row');

		const portraitUrl = this.model.portrait.get();
		if (portraitUrl) {
			this.portrait = Pixies.createElement(info, 'div', 'portrait');
			this.game.assets.getAsset(portraitUrl, (image) => {
				this.portrait.appendChild(image);
			});
		}

		const description = Pixies.createElement(info, 'div', 'description text flex-1');
		description.innerHTML = Pixies.paragraphize(this.model.description.get());

		if (this.game.isInDebugMode.get()) {
			Pixies.magicEditor(titleText, (value) => this.model.name.set(value));
			Pixies.magicEditor(description, (value) => this.model.description.set(value), true);

			const buttons = Pixies.createElement(title, 'div', 'editor-section buttons');
			const back = Pixies.createElement(buttons, 'button');
			back.innerText = 'Back';
			back.addEventListener('click', () => {
				const current = this.model.pastEntries.children.removeLast();
				const prev = this.model.pastEntries.children.removeLast();
				if (prev) {
					this.model.currentEntry.set(prev);
				} else {
					this.model.triggerEvent('restart');
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
				this.saveGame.conversation.set(null);
			});
		}

		this.entries = Pixies.createElement(this.inner, 'div', ['entries', 'scroll']);
		this.entriesRenderer = new CollectionRenderer(this.game, this.model.pastEntries, (model) => new ConversationEntryRenderer(this.game, model, this.entries));
		this.addChild(this.entriesRenderer);

		this.entries.addEventListener('wheel', this.onScroll);

		this.responses = Pixies.createElement(this.inner, 'div', ['responses', 'scroll']);
		if (this.game.isInDebugMode.get()) {
			const buttons = Pixies.createElement(this.inner, 'div', 'editor-section buttons');
			const add = Pixies.createElement(buttons, 'button');
			add.innerText = 'Add Response';
			add.addEventListener('click', () => {
				const currentEntry = this.model.currentEntry.get();
				const newEntry = currentEntry.entries.add(new ConversationEntryModel());
			});
		}

		this.bottom = Pixies.createElement(this.inner, 'div', 'row center');
		this.exit = Pixies.createElement(
			this.bottom,
			'button',
			null,
			'Odejít',
			(e) => {
				e.preventDefault();
				this.saveGame.conversation.set(null);
			}
		);

		this.updateResponses();
		this.model.currentEntry.addOnChangeListener(this.onCurrentEntryChanged);
	}

	deactivateInternal() {
		this.model.currentEntry.removeOnChangeListener(this.onCurrentEntryChanged);
		this.resetChildren();
		this.removeElement(this.container);
		Pixies.removeClass(this.dom, 'container');
	}

	updateResponses() {
		if (this.responsesRenderer) {
			this.removeChild(this.responsesRenderer);
			this.responsesRenderer = null;
		}
		if (this.parentResponsesRenderer) {
			this.removeChild(this.parentResponsesRenderer);
			this.parentResponsesRenderer = null;
		}
		const currentEntry = this.model.currentEntry.get();
		if (currentEntry) {
			this.responsesRenderer = new CollectionRenderer(this.game, currentEntry.entries, (model) => new ConversationResponseRenderer(this.game, model, this.responses, currentEntry));
			this.addChild(this.responsesRenderer);

			if (currentEntry.showParentResponses.get() > 0) {
				const parentEntry = this.findEntryParent(currentEntry, currentEntry.showParentResponses.get());
				if (parentEntry) {
					this.parentResponsesRenderer = new CollectionRenderer(this.game, parentEntry.entries, (model) => new ConversationResponseRenderer(this.game, model, this.responses, currentEntry));
					this.addChild(this.parentResponsesRenderer);
				}
			}
		}

		this.scrollDown();
	}

	scrollDown() {
		this.clearTimer();
		let scrollLastTime = performance.now();
		const scrollAnimation = new AnimatedValue(this.entries.scrollTop, this.entries.scrollHeight, 3000);
		this.scrollTimer = setInterval(
			() => {
				const time = performance.now();
				const delta = time - scrollLastTime;
				this.entries.scrollTop = scrollAnimation.get(delta);
				scrollLastTime = time;
				if (scrollAnimation.isFinished()) {
					this.clearTimer();
				}
			},
		100
		);
	}

	clearTimer() {
		if (this.scrollTimer) {
			clearInterval(this.scrollTimer);
			this.scrollTimer = null;
		}
	}

	findEntryParent(entry, i) {
		if (!entry) return null;
		if (i === 0) return entry;
		return this.findEntryParent(entry.parentEntry.get(), i - 1);
	}
}
