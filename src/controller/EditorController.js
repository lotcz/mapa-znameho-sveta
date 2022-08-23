import ControllerNode from "./basic/ControllerNode";
import ControlsController from "./ControlsController";
import MapController from "./MapController";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../model/savegame/SaveGameModel";
import BattleController from "./BattleController";

export default class EditorController extends ControllerNode {

	/**
	 * @type EditorModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;
		this.onNodeSavedHandler = (param) => this.runOnUpdate((delta) => this.saveNode(param));
		this.onTableSelectedHandler = (name) => this.runOnUpdate((delta) => this.openTable(name));
		this.onTableClosedHandler = () => this.runOnUpdate((delta) => this.closeTable());
		this.onResourcesChanged = () => this.model.makeDirty();
	}

	activateInternal() {
		this.model.addEventListener('node-saved', this.onNodeSavedHandler);
		this.model.addEventListener('table-selected', this.onTableSelectedHandler);
		this.model.addEventListener('table-closed', this.onTableClosedHandler);
		this.game.resources.addOnDirtyListener(this.onResourcesChanged);
		this.game.saveGame.addOnDirtyListener(this.onResourcesChanged);
	}

	deactivateInternal() {
		this.model.removeEventListener('node-saved', this.onNodeSavedHandler);
		this.model.removeEventListener('table-selected', this.onTableSelectedHandler);
		this.model.removeEventListener('table-closed', this.onTableClosedHandler);
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

	closeTable() {
		this.model.activeTable.set(null);
	}

	openTable(name) {
		const table = this.game.resources[name] || this.game.saveGame[name] || this.game.resources.map[name];
		this.model.activeTable.set(table);
	}

}
