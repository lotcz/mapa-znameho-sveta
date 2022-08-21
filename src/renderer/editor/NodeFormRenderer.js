import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import RunningConversationModel from "../../model/savegame/conversation/RunningConversationModel";

export default class NodeFormRenderer extends DomRenderer {

	/**
	 * @type ModelNode
	 */
	model;

	name;

	constructor(game, model, dom, name = null) {
		super(game, model, dom);

		this.model = model;
		this.name = name;
		this.container = null;
	}

	activateInternal() {
		this.container = this.addElement('form');

		const buttons = Pixies.createElement(this.container, 'div');
		const submit = Pixies.createElement(buttons, 'button');
		submit.innerText = 'Save';
		submit.addEventListener('click', (e) => {
			e.preventDefault();
			this.save();
		});

		if (this.name === 'conversations') {
			const submit = Pixies.createElement(buttons, 'button');
			submit.innerText = 'Start';
			submit.addEventListener('click', (e) => {
				e.preventDefault();
				this.game.saveGame.runningConversation.set(new RunningConversationModel(this.model));
			});
		}

		this.model.properties.forEach((name, value) => {
			const item = Pixies.createElement(this.container, 'div');
			const label = Pixies.createElement(item, 'label');
			label.innerText = name;
			label.setAttribute('for', name);
			if (value) {
				if (typeof value.get === 'function') {
					const input = Pixies.createElement(item, 'input');
					input.setAttribute('type', 'text');
					input.setAttribute('name', name);
					input.value = value.get();
				} else {
					const input = Pixies.createElement(item, 'span');
					input.innerText = value.toString();
				}
			}
		});

	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	save() {
		const data = new FormData(this.container);
		this.game.editor.triggerEvent('node-saved', {node: this.model, data: data});
		this.model.triggerEvent('closed');
	}

}
