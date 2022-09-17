import ControllerNode from "../basic/ControllerNode";
import CollectionController from "../basic/CollectionController";
import EditorBattleSpriteController from "./EditorBattleSpriteController";

export default class EditorBattleMapController extends ControllerNode {

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
				(m) => new EditorBattleSpriteController(this.game, m)
			)
		);

		this.addAutoEvent(
			this.model,
			'table-selected',
			(name) => this.runOnUpdate(() => this.model.activeTable.set(this.game.getTableByName(name)))
		);

	}

}
