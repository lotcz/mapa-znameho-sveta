import ControllerNode from "../../basic/ControllerNode";

export default class BattleSpriteController extends ControllerNode {

	/**
	 * @type BattleSpriteModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;


	}

}
