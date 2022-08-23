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
		this.onNodeSavedHandler = (param) => this.runOnUpdate((delta) => this.nodeSaved(param));
		this.onResourcesChanged = () => this.model.makeDirty();
	}

	activateInternal() {
		this.model.addEventListener('node-saved', this.onNodeSavedHandler);
		this.game.resources.addOnDirtyListener(this.onResourcesChanged);
		this.game.saveGame.addOnDirtyListener(this.onResourcesChanged);
	}

	deactivateInternal() {
		this.model.removeEventListener('node-saved', this.onNodeSavedHandler);
		this.game.resources.removeOnDirtyListener(this.onResourcesChanged);
		this.game.saveGame.removeOnDirtyListener(this.onResourcesChanged);
	}

	nodeSaved(param) {
		const node = param.node;
		const data = param.data;
		node.properties.forEach((name, value) => {
			if (value && value.value !== undefined && typeof value.set === 'function') {
				value.set(data.get(name));
			}
		});
	}

}
