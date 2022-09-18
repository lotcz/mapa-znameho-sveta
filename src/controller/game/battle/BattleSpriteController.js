import ControllerNode from "../../basic/ControllerNode";

export default class BattleSpriteController extends ControllerNode {

	/**
	 * @type BattleSpriteModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.model.spriteId,
			'change',
			() => {
				const sprite = this.game.resources.sprites.getById(this.model.spriteId);
				this.model.sprite.set(sprite);
			},
			true
		);
	}

}
