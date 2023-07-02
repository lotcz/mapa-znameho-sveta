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
		this.container.addEventListener('click', this.onContainerEvent);
		this.container.addEventListener('wheel', this.onContainerEvent);

		this.overlay = Pixies.createElement(this.container, 'div', 'overlay container');

		this.panelWrapper = Pixies.createElement(this.container, 'div', 'container column center p-3');
		this.panel = Pixies.createElement(this.panelWrapper, 'div', 'panel paper row stretch overflow-hidden left');
		this.inner = Pixies.createElement(this.panel, 'div', 'inner col overflow-hidden');

		const header = Pixies.createElement(this.inner, 'div', 'header');
		const title = Pixies.createElement(header, 'div', 'row');
		const titleText = Pixies.createElement(title, 'h2', 'title');
		titleText.innerText = this.model.name.get();

		const cols = Pixies.createElement(this.inner, 'div', 'row flex-1 stretch overflow-hidden');
		const left = Pixies.createElement(cols, 'div', 'col');
		const right = Pixies.createElement(cols, 'div', 'col flex-1 scroll');
		this.scroll = right;

		const portraitUrl = this.model.portrait.get();
		if (portraitUrl) {
			const portrait = Pixies.createElement(left, 'div', 'portrait');
			this.game.assets.getAsset(portraitUrl, (image) => {
				portrait.appendChild(image.cloneNode());
			});
		}

		const description = Pixies.createElement(right, 'div', 'description text');
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

		this.entries = Pixies.createElement(right, 'div', 'entries');
		this.entriesRenderer = new CollectionRenderer(
			this.game,
			this.model.pastEntries,
			(model) => new ConversationEntryRenderer(this.game, model, this.entries)
		);
		this.addChild(this.entriesRenderer);

		this.entries.addEventListener('wheel', this.onScroll);

		this.responses = Pixies.createElement(right, 'div', 'responses');
		if (this.game.isInDebugMode.get()) {
			const buttons = Pixies.createElement(this.responses, 'div', 'editor-section buttons');
			const add = Pixies.createElement(buttons, 'button');
			add.innerText = 'Add Response';
			add.addEventListener('click', () => {
				const currentEntry = this.model.currentEntry.get();
				const respo = new ConversationEntryModel();
				respo.responseText.set('--response--');
				const newEntry = currentEntry.entries.add(respo);
			});
		}

		this.bottom = Pixies.createElement(right, 'div', 'row center');
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
		this.container = null;
		this.responses = null;
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
		const scrollAnimation = new AnimatedValue(this.scroll.scrollTop, this.scroll.scrollHeight, 3000);
		this.scrollTimer = setInterval(
			() => {
				const time = performance.now();
				const delta = time - scrollLastTime;
				this.scroll.scrollTop = scrollAnimation.get(delta);
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
