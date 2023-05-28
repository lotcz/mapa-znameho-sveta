import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import NodeTableRenderer from "./NodeTableRenderer";
import TableLookupRenderer from "./TableLookupRenderer";
import CharacterStatsModel from "../../model/game/party/stats/CharacterStatsModel";
import LevelStatsModel from "../../model/game/party/stats/LevelStatsModel";

export default class NodeFormRenderer extends DomRenderer {

	/**
	 * @type ModelNode
	 */
	model;

	constructor(game, model, dom, collection = null) {
		super(game, model, dom);

		this.model = model;
		this.collection = collection;
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

		if (this.collection) {
			Pixies.createElement(buttonsLeft, 'button', null, 'Clone',
				(e) => {
					e.preventDefault();
					this.game.editor.triggerEvent('node-clone', {table: this.collection, node: this.model});
				}
			);
			Pixies.createElement(buttonsLeft, 'button', 'red', 'Delete',
				(e) => {
					e.preventDefault();
					this.game.editor.triggerEvent('node-delete', {table: this.collection, node: this.model});
				}
			);
		}

		Pixies.createElement(
			buttonsRight,
			'button',
			null,
			'Close',
			(e) => {
				e.preventDefault();
				if (this.game.editor.activeForm.equalsTo(this.model)) {
					this.game.editor.triggerEvent('form-closed');
				}
				if (this.collection) {
					this.collection.selectedNode.set(null);
				}
			}
		);

		if (this.model.constructor.name === 'ConversationModel') {
			Pixies.createElement(
				buttonsLeft,
				'button',
				'special',
				'Start',
				(e) => {
					e.preventDefault();
					this.game.saveGame.get().conversation.set(this.model);
				}
			);
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

		if (this.model.constructor.name === 'MaterialModel') {
			Pixies.createElement(
				buttonsLeft,
				'button',
				'special',
				'Preview',
				(e) => {
					e.preventDefault();
					this.game.editor.activeMaterial.set(this.model);
				}
			);
		}

		if (this.model.constructor.name === 'PathModel') {
			const start = Pixies.createElement(buttonsLeft, 'button', 'special');
			start.innerText = 'Add Waypoint';
			start.addEventListener('click', (e) => {
				e.preventDefault();
				this.model.addWaypoint();
			});
		}

		if (this.model.constructor.name === 'CharacterModel') {
			if (this.model.originalId.isSet()) {
				Pixies.createElement(
					buttonsLeft,
					'button',
					'blue',
					'Update Template',
					(e) => {
						e.preventDefault();
						const templateId = this.model.originalId.get();
						const template = this.game.resources.characterTemplates.getById(templateId);
						template.restoreState(this.model.getState());
						template.originalId.set(null);
						template.id.set(templateId);
					}
				);
			}

			Pixies.createElement(
				buttonsLeft,
				'button',
				'special',
				'Join Party!',
				(e) => {
					e.preventDefault();
					const save = this.game.saveGame.get();
					save.addCharacterToParty(this.model);
				}
			);

			Pixies.createElement(
				buttonsLeft,
				'button',
				'special',
				'Level Up!',
				(e) => {
					e.preventDefault();
					const exp = LevelStatsModel.getLevelExperienceRequirement(this.model.stats.level.currentLevel.get() + 1);
					this.model.stats.level.gainExperience(exp - this.model.stats.level.experience.get() + 1);
				}
			);

			Pixies.createElement(
				buttonsLeft,
				'button',
				'special',
				'Get 100 Exp',
				(e) => {
					e.preventDefault();
					this.model.stats.level.gainExperience(100);
				}
			);

			const reset = Pixies.createElement(buttonsLeft, 'button', 'red');
			reset.innerText = 'Reset Stats';
			reset.addEventListener('click', (e) => {
				e.preventDefault();
				const fresh = new CharacterStatsModel();
				this.model.stats.restoreState(fresh.getState());
			});
		}

		if (this.model.constructor.name === 'SequenceModel') {
			const start = Pixies.createElement(buttonsLeft, 'button', 'special');
			start.innerText = 'Start';
			start.addEventListener('click', (e) => {
				e.preventDefault();
				const save = this.game.saveGame.get();
				save.triggerEvent('start-sequence', this.model.id.get());
			});
		}

		if (this.model.constructor.name === 'SequenceStepBackgroundModel') {
			Pixies.createElement(
				buttonsLeft,
				'button',
				'blue',
				'Set start',
				(e) => {
					e.preventDefault();
					this.model.setStart();
				}
			);
			Pixies.createElement(
				buttonsLeft,
				'button',
				'blue',
				'Set end',
				(e) => {
					e.preventDefault();
					this.model.setEnd();
				}
			);
		}

		if (this.model.constructor.name === 'SequenceStepModel') {
			Pixies.createElement(
				buttonsLeft,
				'button',
				'special',
			'Capture',
			(e) => {
					e.preventDefault();
					const save = this.game.saveGame.get();
					this.model.coordinates.set(save.mapCenterCoordinates);
					this.model.zoom.set(save.zoom.get());
				}
			);
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

		if (name === 'color' && typeof value === 'string') {
			const input = Pixies.createElement(container, 'input', 'color');
			input.setAttribute('type', 'color');
			input.setAttribute('name', name);
			input.value = value;
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
			if (value.constructor.name === 'IntValue' && TableLookupRenderer.isTableLookupField(name)) {
				Pixies.addClass(container, 'with-lookup');
				Pixies.createElement(
					container,
					'button',
					'lookup-button',
					'Select...',
					(e) => {
						e.preventDefault();
						const lookupRenderer = new TableLookupRenderer(this.game, value, container, name);
						value.addEventListener('table-closed', () => {
							lookupRenderer.deactivate();
						});
						lookupRenderer.activate();
					}
				);
			}
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
