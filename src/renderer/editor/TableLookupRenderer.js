import Pixies from "../../class/basic/Pixies";
import DomRenderer from "../basic/DomRenderer";

const FIELD_TABLE_MAPPINGS = {
	raceId: 'races',
	characterId: 'characters',
	characterTemplateId: 'characterTemplates',
	modelId: 'models3d',
	male3dModelId: 'models3d',
	female3dModelId: 'models3d',
	hairItemDefinitionId: 'itemDefinitions',
	definitionId: 'itemDefinitions',
	itemDefId: 'itemDefinitions',
	materialId: 'materials',
	skinMaterialId: 'materials',
	hairMaterialId: 'materials',
	primaryMaterialId: 'materials',
	secondaryMaterialId: 'materials',
	spriteId: 'sprites',
	sprite3dId: 'sprites3d',
	biotopeId: 'biotopes',
	startLocationId: 'locations',
	endLocationId: 'locations',
	battleMapId: 'battleMaps',
	statId: 'statDefinitions',
	parentStageId: 'quests',
	requiresStageId: 'quests',
	completesStageId: 'quests',
	npcConversationId: 'conversations',
	partyConversationId: 'conversations'
}

const RENDER_FIELDS = ['id', 'name'];

export default class TableLookupRenderer extends DomRenderer {

	/**
	 * @type IntValue
	 */
	model;

	constructor(game, model, dom, fieldName) {
		super(game, model, dom);

		this.model = model;
		this.lookupTable = this.getTableByField(fieldName);
		this.container = null;
	}

	activateInternal() {
		this.container = this.addElement('div', 'table-lookup force-foreground p-2');
		this.container.addEventListener('wheel', (e) => e.stopPropagation());

		this.buttons = Pixies.createElement(this.container, 'div', 'buttons row stretch');
		this.input = Pixies.createElement(this.buttons,'input', 'flex-1')
		this.input.setAttribute('type', 'text');
		this.input.addEventListener('input', () => this.renderItems());
		Pixies.createElement(this.buttons,'button',null,'Reset',() => {
			this.input.value = '';
			this.renderItems();
		});
		Pixies.createElement(this.buttons,'button',null,'Close',() => this.model.triggerEvent('table-closed'));

		this.scrollable = Pixies.createElement(this.container, 'div', 'scroll p-1');
		this.table = Pixies.createElement(this.scrollable, 'table');

		const thead = Pixies.createElement(this.table, 'thead');
		const header = Pixies.createElement(thead, 'tr');
		RENDER_FIELDS.forEach((name) => {
			const cell = Pixies.createElement(header, 'th');
			cell.innerText = name;
		});

		this.tbody = Pixies.createElement(this.table, 'tbody');
		this.renderItems();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	getTableByField(name) {
		return this.game.getTableByName(FIELD_TABLE_MAPPINGS[name]);
	}

	static isTableLookupField(name) {
		return Object.keys(FIELD_TABLE_MAPPINGS).includes(name);
	}

	renderItems() {
		Pixies.emptyElement(this.tbody);
		const search = this.input.value.toLowerCase();
		const searchId = Number(search);
		this.lookupTable
			.filter((m) => {
				if (search === '') {
					return true;
				}
				if (!Number.isNaN(searchId)) {
					return m.id.equalsTo(searchId);
				}
				const name = m.name.get();
				return name.toLowerCase().includes(search);
			})
			.forEach(
			(node) => {
				const tr = Pixies.createElement(
					this.tbody,
					'tr',
					node.id.equalsTo(this.model.get()) ? 'active' : null,
					null,
					() => {
						this.model.set(node.id.get());
						this.model.triggerEvent('table-closed');
					}
				);
				RENDER_FIELDS.forEach((name) => {
					const cell = Pixies.createElement(tr, 'td');
					cell.innerText = node[name].get();
				});
			}
		);
	}
}
