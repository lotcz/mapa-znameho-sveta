import ControllerNode from "./basic/ControllerNode";

export default class EditorController extends ControllerNode {

	/**
	 * @type EditorModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;
		this.onTableSelectedHandler = (name) => this.runOnUpdate(() => {

			this.model.activeTable.set(this.game.getTableByName(name));
		});
		this.onTableClosedHandler = () => this.runOnUpdate(() => this.model.activeTable.set(null));
		this.onRowSelectedHandler = (item) => this.runOnUpdate(() => this.model.activeForm.set(item));
		this.onNodeSavedHandler = (param) => this.runOnUpdate(() => this.saveNode(param));
		this.onFormClosedHandler = () => this.runOnUpdate(() =>  this.model.activeForm.set(null));
		this.onResourcesChanged = () => this.model.makeDirty();
	}

	activateInternal() {
		this.model.addEventListener('table-selected', this.onTableSelectedHandler);
		this.model.addEventListener('table-closed', this.onTableClosedHandler);
		this.model.addEventListener('row-selected', this.onRowSelectedHandler);
		this.model.addEventListener('node-saved', this.onNodeSavedHandler);
		this.model.addEventListener('form-closed', this.onFormClosedHandler);
		this.game.resources.addOnDirtyListener(this.onResourcesChanged);
		this.game.saveGame.addOnDirtyListener(this.onResourcesChanged);
	}

	deactivateInternal() {
		this.model.removeEventListener('table-selected', this.onTableSelectedHandler);
		this.model.removeEventListener('table-closed', this.onTableClosedHandler);
		this.model.removeEventListener('row-selected', this.onRowSelectedHandler);
		this.model.removeEventListener('node-saved', this.onNodeSavedHandler);
		this.model.removeEventListener('form-closed', this.onFormClosedHandler);
		this.game.resources.removeOnDirtyListener(this.onResourcesChanged);
		this.game.saveGame.removeOnDirtyListener(this.onResourcesChanged);
	}

	saveNode(param) {
		const node = param.node;
		const data = param.data;
		node.properties.forEach((name, value) => {
			if (value && value.value !== undefined && typeof value.set === 'function') {
				value.set(data.get(name));
			}
		});
	}

}
