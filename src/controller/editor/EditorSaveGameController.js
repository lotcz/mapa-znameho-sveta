import ControllerNode from "../basic/ControllerNode";
import NullableNodeController from "../basic/NullableNodeController";
import EditorBattleController from "./EditorBattleController";

export default class EditorSaveGameController extends ControllerNode {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.currentBattle,
				(m) => new EditorBattleController(this.game, m)
			)
		);

	}

}
