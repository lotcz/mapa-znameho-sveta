import ControllerNode from "../basic/ControllerNode";
import EditorSaveGameController from "./EditorSaveGameController";
import NullableNodeController from "../basic/NullableNodeController";

export default class EditorController extends ControllerNode {

	/**
	 * @type EditorModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new NullableNodeController(
				this.game,
				this.game.saveGame,
				(m) => new EditorSaveGameController(this.game, m)
			)
		);

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
			() => this.runOnUpdate(() => this.model.activeForm.set(null))
		);

		this.addAutoEvent(
			this.model,
			'node-delete',
			(param) => this.runOnUpdate(() => this.deleteNode(param))
		);

		this.addAutoEvent(
			this.model,
			'node-clone',
			(param) => this.runOnUpdate(() => this.cloneNode(param))
		);

		this.addAutoEvent(
			this.model,
			'download-resources',
			(param) => this.runOnUpdate(() => this.downloadResources(param))
		);

		this.addAutoEvent(
			this.model,
			'switch-options',
			(param) => this.runOnUpdate(
				() => this.model.isOptionsVisible.set(!this.model.isOptionsVisible.get()))
		);

	}

	updateInternal(delta) {
		if (this.model.activeItemMounting.isSet()) {
			this.model.activeItemMounting.get().makeDirty();
		}
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
				} else {
					console.log(data.get(name), name);
				}
			} else if (data.has(`${name}[]`)) {
				if (typeof value === 'object' && typeof value.setFromArray === 'function') {
					const arr = data.getAll(`${name}[]`);
					value.setFromArray(arr);
				}
			} else if (value && typeof value.value === 'boolean' && typeof value.set === 'function') {
				value.set(false);
			}
		});
	}

	deleteNode(param) {
		const node = param.node;
		const table = param.table;
		const result = table.remove(node);
		if (table.selectedNode.equalsTo(node)) {
			table.selectedNode.set(null);
		}
		console.log('removed node', result);
	}

	cloneNode(param) {
		const node = param.node;
		const table = param.table;
		const result = table.add();
		if (typeof result.id === 'object' && typeof result.id.get === 'function') {
			const id = result.id.get();
			result.restoreState(node.getState());
			result.id.set(id);
		} else {
			result.restoreState(node.getState());
		}
		table.selectedNode.set(result);
		console.log('cloned node', result);
	}

	downloadResources() {
		const element = document.createElement('a');
		const str = JSON.stringify(this.game.resources.getState());
		element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(str));
		element.setAttribute('download', 'resources.json');
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

}
