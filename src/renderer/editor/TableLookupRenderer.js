import Pixies from "../../class/basic/Pixies";
import DomRenderer from "../basic/DomRenderer";

const FIELD_TABLE_MAPPINGS = {
	raceId: 'races',
	characterId: 'characters',
	modelId: 'models3d',
	male3dModelId: 'models3d',
	female3dModelId: 'models3d',
	hairItemDefinitionId: 'itemDefinitions',
	definitionId: 'itemDefinitions',
	skinMaterialId: 'materials',
	hairMaterialId: 'materials',
	primaryMaterialId: 'materials',
	secondaryMaterialId: 'materials',
	biotopeId: 'biotopes',
	startLocationId: 'locations',
	endLocationId: 'locations',
	battleMapId: 'battleMaps'
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
		this.container = this.addElement('div', 'table table-lookup bg force-foreground');

		this.buttons = Pixies.createElement(this.container, 'div', 'buttons');
		Pixies.createElement(
			this.buttons,
			'button',
			null,
			'Close',
			() => {
				this.model.triggerEvent('table-closed');
			}
		);

		this.scrollable = Pixies.createElement(this.container, 'div', 'scroll');
		this.table = Pixies.createElement(this.scrollable, 'table');

		const thead = Pixies.createElement(this.table, 'thead');
		const header = Pixies.createElement(thead, 'tr');
		RENDER_FIELDS.forEach((name) => {
			const cell = Pixies.createElement(header, 'th');
			cell.innerText = name;
		});

		this.tbody = Pixies.createElement(this.table, 'tbody');
		this.lookupTable.forEach(
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

	deactivateInternal() {
		this.removeElement(this.container);
	}

	getTableByField(name) {
		return this.game.getTableByName(FIELD_TABLE_MAPPINGS[name]);
	}

	static isTableLookupField(name) {
		return Object.keys(FIELD_TABLE_MAPPINGS).includes(name);
	}

}
