import ControllerNode from "../basic/ControllerNode";
import BattleEditorModel from "../../model/editor/BattleEditorModel";

export default class EditorBattleMapController extends ControllerNode {

	/**
	 * @type BattleMapModel
	 */
	model;

	constructor(game, model) {
		super(game, model);
		this.model = model;


	}

	activateInternal() {
		this.game.editor.battleEditor.set(new BattleEditorModel(this.model));
	}

	deactivateInternal() {
		this.game.editor.battleEditor.set(null);
	}

}
