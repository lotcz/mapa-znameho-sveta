import ControllerWithBattle from "../../basic/ControllerWithBattle";
import Pixies from "../../../class/basic/Pixies";
import CharacterController from "../party/CharacterController";
import NullableNodeController from "../../basic/NullableNodeController";

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

		this.idleTimeout = Math.random() * IDLE_ACTION_TIMEOUT;

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.character,
				(m) => new CharacterController(this.game, m)
			)
		);

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
		const free = this.battle.pathFinder.getFreeNeighborPositions(this.model.homePosition, 2);
		if (free.length === 0) return;
		const rand = Pixies.randomElement(free);
		this.model.triggerEvent('go-to', rand);
	}
}
