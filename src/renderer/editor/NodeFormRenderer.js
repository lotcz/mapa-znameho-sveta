import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import NodeTableRenderer from "./NodeTableRenderer";

export default class NodeFormRenderer extends DomRenderer {

	/**
	 * @type ModelNode
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.name = name;
		this.container = null;
		this.fields = null;
	}

	activateInternal() {
		this.container = this.addElement('form', 'bg');

		const buttons = Pixies.createElement(this.container, 'div', 'buttons');
		const buttonsLeft = Pixies.createElement(buttons, 'div');
		const buttonsRight = Pixies.createElement(buttons, 'div');

		const submit = Pixies.createElement(buttonsLeft, 'button');
		submit.innerText = 'Save';
		submit.addEventListener('click', (e) => {
			e.preventDefault();
			this.save();
		});

		const del = Pixies.createElement(buttonsLeft, 'button', 'red', 'Del',
			(e) => {
				e.preventDefault();
				this.model.triggerEvent('node-delete', this.model);
			}
		);

		const close = Pixies.createElement(buttonsRight, 'button');
		close.innerText = 'Close';
		close.addEventListener('click', (e) => {
			e.preventDefault();
			if (this.game.editor.activeForm.equalsTo(this.model)) {
				this.game.editor.triggerEvent('form-closed');
			}
			this.model.triggerEvent('form-closed');
		});

		if (this.model.constructor.name === 'ConversationModel') {
			const start = Pixies.createElement(buttonsLeft, 'button', 'special');
			start.innerText = 'Start';
			start.addEventListener('click', (e) => {
				e.preventDefault();
				this.game.saveGame.get().conversation.set(this.model);
			});
		}

		if (this.model.constructor.name === 'ItemDefinitionModel') {
			Pixies.createElement(
				buttonsLeft,
				'button',
				'special',
				'Edit image',
			 	(e) => {
					e.preventDefault();
					this.game.editor.activeItemImageDefinition.set(this.model);
				}
			);
			Pixies.createElement(
				buttonsLeft,
				'button',
				'special',
				'Edit mounting',
				(e) => {
					e.preventDefault();
					this.game.editor.activeItemMounting.set(this.model);
				}
			);
		}

		if (this.model.constructor.name === 'PathModel') {
			const start = Pixies.createElement(buttonsLeft, 'button', 'special');
			start.innerText = 'Add waypoint';
			start.addEventListener('click', (e) => {
				e.preventDefault();
				this.model.addWaypoint();
			});
		}

		this.fields = Pixies.createElement(this.container, 'div', 'fields scroll');
		this.renderFields();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		this.renderFields();
	}

	renderInput(container, name, value) {
		if (value === undefined) {
			Pixies.createElement(container, 'span', null, '--undefined--');
			return;
		}

		if (value === null) {
			Pixies.createElement(container, 'span', null, '--null--');
			return;
		}

		if (typeof value === 'object' && value.x !== undefined && value.y !== undefined) {
			Pixies.addClass(container, 'vector');
			this.renderInput(container, `${name}[]`, value.x);
			this.renderInput(container, `${name}[]`, value.y);
			if (value.z !== undefined) {
				this.renderInput(container, `${name}[]`, value.z);
				if (value.w !== undefined) {
					this.renderInput(container, `${name}[]`, value.w);
				}
			}
			return;
		}

		if (typeof value === 'object' && (value.constructor.name === 'ModelNodeTable' || value.constructor.name === 'ModelNodeCollection' )) {
			const tableRenderer = new NodeTableRenderer(this.game, value, container);
			tableRenderer.activate();
			return;
		}

		if (typeof value === 'object' && value.value !== undefined) {
			this.renderInput(container, name, value.value);
			return;
		}

		if (typeof value === 'object') {
			Pixies.createElement(container, 'span', null, '[Object]');
			return;
		}

		if (typeof value === 'boolean') {
			const input = Pixies.createElement(container, 'input');
			input.setAttribute('type', 'checkbox');
			input.setAttribute('name', name);
			input.checked = value;
			return;
		}

		const input = Pixies.createElement(container, 'input');
		input.setAttribute('type', 'text');
		input.setAttribute('name', name);
		input.value = value.toString();
	}

	renderField(container, name, value) {
		const row = Pixies.createElement(container, 'div', 'row');
		const label = Pixies.createElement(row, 'label', null, name);
		label.setAttribute('for', name);
		const item = Pixies.createElement(row, 'div', 'field');
		this.renderInput(item, name, value);
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
		this.game.editor.triggerEvent('form-closed');
	}

}
