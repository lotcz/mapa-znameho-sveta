import ControllerWithBattle from "../../basic/ControllerWithBattle";
import Pixies from "../../../class/basic/Pixies";

const IDLE_ACTION_TIMEOUT = 15000;
const IDLE_ACTION_CHANCE = 0.5;

export default class NpcBattleCharacterWithCharacterController extends ControllerWithBattle {

	/**
	 * @type BattleNpcCharacterModel
	 */
	model;

	/**
	 * @type CharacterModel
	 */
	character;

	constructor(game, character, model) {
		super(game, model);

		this.model = model;
		this.character = character;

		this.idleTimeout = Math.random() * IDLE_ACTION_TIMEOUT;

		this.addAutoEvent(
			this.character.stats.isAggressive,
			'change',
			() => {
				this.battle.triggerEvent('check-fighting');
			},
			true
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
