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
		this.fields = null;
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

		this.fields = Pixies.createElement(this.container, 'div', 'fields');
		this.renderFields();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		this.renderFields();
	}

	renderInput(container, name, value) {
		const input = Pixies.createElement(container, 'input');
		input.setAttribute('type', 'text');
		input.setAttribute('name', name);
		input.value = (typeof value.get === 'function') ? value.get() : value.toString();
	}

	renderField(container, name, value) {
		const row = Pixies.createElement(container, 'div', 'row');
		const label = Pixies.createElement(row, 'label', null, name);
		label.setAttribute('for', name);
		const item = Pixies.createElement(row, 'div', 'field');
		if (value !== null && value !== undefined) {
			if (value && value.x !== undefined && value.y !== undefined) {
				this.renderInput(item, name, value.x);
				this.renderInput(item, name, value.y);
				if (value.z !== undefined) {
					this.renderInput(item, name, value.z);
				}
			} else {
				this.renderInput(item, name, value);
			}
		}
	}

	renderFields() {
		Pixies.emptyElement(this.fields);
		this.model.properties.forEach((name, value) => {
			this.renderField(this.fields, name, value);
		});
	}

	save() {
		const data = new FormData(this.container);
		this.game.editor.triggerEvent('node-saved', {node: this.model, data: data});
		this.model.triggerEvent('closed');
	}

}
