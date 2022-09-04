import ControllerNode from "./basic/ControllerNode";

export default class EditorController extends ControllerNode {

	/**
	 * @type EditorModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.model,
			'table-selected',
			(name) => this.runOnUpdate(() => this.model.activeTable.set(this.game.getTableByName(name)))
		);

		this.addAutoEvent(
			this.model,
			'table-closed',
			() => this.runOnUpdate(() => this.model.activeTable.set(null))
		);

		this.addAutoEvent(
			this.model,
			'node-saved',
			(param) => this.runOnUpdate(() => this.saveNode(param))
		);

		this.addAutoEvent(
			this.model,
			'form-closed',
			() => this.runOnUpdate(() =>  this.model.activeForm.set(null))
		);

		this.addAutoEvent(
			this.model,
			'node-delete',
			(param) => this.runOnUpdate(() => this.deleteNode(param))
		);

		//this.onResourcesChanged = () => this.model.makeDirty();

		//this.addAutoEvent(this.model, 'row-selected', (node) => this.runOnUpdate(() => this.nodeSelected(node)));
	}

	activateInternal() {


		//this.game.resources.addOnDirtyListener(this.onResourcesChanged);
		//this.game.saveGame.addOnDirtyListener(this.onResourcesChanged);
	}

	deactivateInternal() {


		//this.game.resources.removeOnDirtyListener(this.onResourcesChanged);
		//this.game.saveGame.removeOnDirtyListener(this.onResourcesChanged);
	}

	/**
	 *
	 * * @param {Object} param
	 *  * @param {ModelNode} param.node
	 *  * @param {FormData} param.data
	 */
	saveNode(param) {
		const node = param.node;
		const data = param.data;
		node.properties.forEach((name, value) => {
			if (data.has(name)) {
				if (value && value.value !== undefined && typeof value.set === 'function') {
					value.set(data.get(name));
				}
			} else if (value && typeof value.value === 'boolean' && typeof value.set === 'function') {
				value.set(false);
			}
		});
	}

	deleteNode(param) {
		const node = param.node;
		const table = param.table;
		if (!table) {
			console.log('no active table, node cannot be deleted', node);
			return;
		}
		const result = table.remove(node);
		console.log('removed node', result);
	}

}
