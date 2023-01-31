import {SPECIAL_TYPE_EXIT, SPECIAL_TYPE_SEQUENCE} from "../../../model/game/battle/battlemap/BattleSpecialModel";
import ControllerSavedGameNode from "../../basic/ControllerSavedGameNode";

export default class SelectedBattleCharacterController extends ControllerSavedGameNode {

	/**
	 * @type BattleCharacterModel
	 */
	model;

	constructor(game, model, saveGame, battle) {
		super(game, model, saveGame);

		this.model = model;
		this.battle = battle;
		this.battleMap = battle.battleMap.get();

		this.addAutoEvent(
			this.model.position,
			'change',
			() => {
				const coords = this.battleMap.positionToScreenCoords(this.model.position);
				this.battle.coordinates.set(coords);
			}
		);

		this.addAutoEvent(
			this.model,
			'arrived-idle',
			(position) => {
				const specials = this.battleMap.specials.filter((s) => s.position.equalsTo(position));
				if (specials.length === 0) return;
				const exit = specials.find((s) => s.type.equalsTo(SPECIAL_TYPE_EXIT));
				if (exit) {
					if (exit.data.isSet()) {
						this.saveGame.triggerEvent('to-battle', exit.data.get());
					} else {
						this.saveGame.triggerEvent('to-map');
					}
					return;
				}
				const seq = specials.find((s) => s.type.equalsTo(SPECIAL_TYPE_SEQUENCE));
				if (seq) {
					const sequenceId = seq.data.get();
					const sequence = this.game.resources.sequences.getById(sequenceId);
					this.saveGame.animationSequence.set(sequence);
				}

			}
		);

	}

}
