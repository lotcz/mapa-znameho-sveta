import ControllerNode from "../../basic/ControllerNode";
import CollectionController from "../../basic/CollectionController";
import BattleSpriteController from "./BattleSpriteController";

export default class BattleMapController extends ControllerNode {

	/**
	 * @type BattleMapModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new CollectionController(
				this.game,
				this.model.sprites,
				(m) => new BattleSpriteController(this.game, m)
			)
		);

	}

}
