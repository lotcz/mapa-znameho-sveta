import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";

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

		const buttons = Pixies.createElement(this.container, 'div', 'buttons');
		const buttonsLeft = Pixies.createElement(buttons, 'div');
		const buttonsRight = Pixies.createElement(buttons, 'div');

		const submit = Pixies.createElement(buttonsLeft, 'button');
		submit.innerText = 'Save';
		submit.addEventListener('click', (e) => {
			e.preventDefault();
			this.save();
		});

		if (this.name === 'conversations') {
			const start = Pixies.createElement(buttonsRight, 'button');
			start.innerText = 'Start';
			start.addEventListener('click', (e) => {
				e.preventDefault();
				//const conversation = this.model.clone();
				this.game.saveGame.conversation.set(this.model);
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
