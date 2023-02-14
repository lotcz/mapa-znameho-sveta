import NullableNodeController from "../basic/NullableNodeController";
import ControllerNode from "../basic/ControllerNode";
import EditorBattleMapController from "./EditorBattleMapController";

export default class EditorBattleController extends ControllerNode {

	/**
	 * @type BattleModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.battleMap,
				(m) => new EditorBattleMapController(this.game, m)
			)
		);
	}

}
