import ControllerWithBattle from "../../basic/ControllerWithBattle";
import Vector2 from "../../../model/basic/Vector2";
import Pixies from "../../../class/basic/Pixies";

const IDLE_ACTION_TIMEOUT = 15000;
const IDLE_ACTION_CHANCE = 0.5;

export default class NpcBattleCharacterController extends ControllerWithBattle {

	/**
	 * @type BattleNpcCharacterModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;
		this.battleMap = this.battle.battleMap.get();

		this.idleTimeout = IDLE_ACTION_TIMEOUT;
	}

	updateInternal(delta) {
		this.idleTimeout -= delta;
		if (this.idleTimeout <= 0) {
			this.idleTimeout += IDLE_ACTION_TIMEOUT;
			if (Math.random() < IDLE_ACTION_CHANCE) {
				this.performIdleAction();
			}
		}
	}

	performIdleAction() {
		const rand = this.model.homePosition.add(new Vector2(Pixies.random(-5, 5), Pixies.random(-5, 5))).round();
		this.model.triggerEvent('go-to', rand);
	}
}
