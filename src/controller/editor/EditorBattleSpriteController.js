import ControllerNode from "../basic/ControllerNode";

export default class EditorBattleSpriteController extends ControllerNode {

	/**
	 * @type BattleSpriteModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.model,
			'sprite-click',
			() => this.runOnUpdate(
				() => this.game.editor.activeBattleSprite.set(this.model)
			)
		);

	}

}
