import {
	SPECIAL_TYPE_CONVERSATION_LOC,
	SPECIAL_TYPE_EXIT,
	SPECIAL_TYPE_SEQUENCE
} from "../../../model/game/battle/battlemap/BattleSpecialModel";
import ControllerWithBattle from "../../basic/ControllerWithBattle";

export default class SelectedBattleCharacterController extends ControllerWithBattle {

	/**
	 * @type BattleCharacterModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

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
				const con = specials.find((s) => s.type.equalsTo(SPECIAL_TYPE_CONVERSATION_LOC));
				if (con) {
					const conversationId = con.data.get();
					const conversation = this.game.resources.conversations.getById(conversationId);
					this.saveGame.conversation.set(conversation);
				}
				const seq = specials.find((s) => s.type.equalsTo(SPECIAL_TYPE_SEQUENCE));
				if (seq) {
					const sequenceId = seq.data.get();
					const sequence = this.game.resources.sequences.getById(sequenceId);
					this.saveGame.animationSequence.set(sequence);
				}
			}
		);

		this.addAutoEvent(
			this.model,
			'caught-up',
			(battleCharacter) => {
				if (!battleCharacter) return;
				const character = battleCharacter.character.get();
				const conversation = this.game.resources.conversations.getById(character.npcConversationId.get());
				this.saveGame.conversation.set(conversation);
			}
		);
	}

}
