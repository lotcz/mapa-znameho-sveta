import ControllerNode from "../../basic/ControllerNode";
import CollectionController from "../../basic/CollectionController";
import BattleSpriteController from "./BattleSpriteController";
import BattleSprite3dController from "./BattleSprite3dController";

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

		this.addChild(
			new CollectionController(
				this.game,
				this.model.sprites3d,
				(m) => new BattleSprite3dController(this.game, m)
			)
		);

	}

}
