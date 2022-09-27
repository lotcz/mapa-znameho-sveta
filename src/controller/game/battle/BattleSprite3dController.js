import ControllerNode from "../../basic/ControllerNode";

export default class BattleSprite3dController extends ControllerNode {

	/**
	 * @type BattleSprite3dModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.model.sprite3dId,
			'change',
			() => {
				const sprite = this.game.resources.sprites.getById(this.model.sprite3dId);
				this.model.sprite.set(sprite);
			},
			true
		);
	}

}
