import ControllerNode from "../node/ControllerNode";
import DirtyValue from "../node/DirtyValue";

const TRAVEL_SPEED = 10; // px per second

export default class BattleCharacterController extends ControllerNode {

	/**
	 * @type BattleCharacterModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

	}

	activateInternal() {

	}

	deactivateInternal() {

	}

	updateInternal(delta) {

	}

}
