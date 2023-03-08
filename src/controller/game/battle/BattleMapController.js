import CollectionController from "../../basic/CollectionController";
import BattleSpriteController from "./BattleSpriteController";
import BattleSprite3dController from "./BattleSprite3dController";
import ControllerWithBattle from "../../basic/ControllerWithBattle";

export default class BattleMapController extends ControllerWithBattle {

	/**
	 * @type BattleMapModel
	 */
	model;

	constructor(game, model) {
		super(game, model, null, model);

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

		this.addAutoEvent(
			this.model,
			'blocks-changed',
			() => this.updateStaticBlocks()
		);

	}

	updateStaticBlocks() {
		this.battle.pathFinder.setStaticBlocks(this.model.getBlocks());
	}

	afterActivatedInternal() {
		this.updateStaticBlocks();
	}

}
