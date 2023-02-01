import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";
import CollectionRenderer from "../../basic/CollectionRenderer";
import ConversationLineRenderer from "./ConversationLineRenderer";
import ConversationLineModel from "../../../model/game/conversation/ConversationLineModel";

export default class ConversationEntryRenderer extends DomRenderer {

	/**
	 * @type ConversationEntryModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.container = null;

	}

	activateInternal() {
		this.container = this.addElement('div', 'entry');

		const response = Pixies.createElement(this.container, 'div', 'line response ml-2');
		if (this.model.responseCharacter.isSet() && this.model.responseText.isSet() && this.model.responseText.get().length > 0) {
			const portrait = Pixies.createElement(response, 'div', 'portrait');
			this.game.assets.getAsset(this.model.responseCharacter.get().portrait.get(), (img) => portrait.appendChild(img.cloneNode(false)));
			this.text = Pixies.createElement(response, 'div', 'text');
			this.text.innerText = this.model.responseText.get();
			if (this.game.isInDebugMode.get()) {
				Pixies.magicEditor(this.text, (value) => this.model.responseText.set(value));
			}
		} else if (this.game.isInDebugMode.get()) {
			this.text = Pixies.createElement(response, 'div', 'text');
			this.text.innerText = '-no-response-text-';
			Pixies.magicEditor(this.text, (value) => this.model.responseText.set(value));
		}

		this.lines = Pixies.createElement(this.container, 'div', 'lines');
		this.addChild(new CollectionRenderer(this.game, this.model.lines, (model) => new ConversationLineRenderer(this.game, model, this.lines, this.model)));

		if (this.game.isInDebugMode.get()) {
			const buttons = Pixies.createElement(this.container, 'div', 'buttons');
			const add = Pixies.createElement(buttons, 'button');
			add.innerText = 'Add Line';
			add.addEventListener('click', () => {
				const newLine = this.model.lines.add(new ConversationLineModel());
				newLine.text.set('line text');
			});

			this.exitAvailable = Pixies.createElement(buttons, 'input');
			this.exitAvailable.setAttribute('type', 'checkbox');
			this.exitAvailable.checked = this.model.isExitAvailable.get();
			this.exitAvailable.addEventListener('change', () => {
				this.model.isExitAvailable.set(this.exitAvailable.checked);
			});

			this.parentResponses = Pixies.createElement(buttons, 'input');
			this.parentResponses.setAttribute('type', 'text');
			this.parentResponses.value = this.model.showParentResponses.get();
			this.parentResponses.addEventListener('change', () => {
				this.model.showParentResponses.set(this.parentResponses.value);
			});
		}
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

}
