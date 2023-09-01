import ControllerWithBattle from "../../basic/ControllerWithBattle";
import CharacterController from "../party/CharacterController";
import NullableNodeController from "../../basic/NullableNodeController";
import NpcBattleCharacterWithCharacterController from "./NpcBattleCharacterWithCharacterController";

export default class NpcBattleCharacterController extends ControllerWithBattle {

	/**
	 * @type BattleNpcCharacterModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.character,
				(m)=> new CharacterController(this.game, m)
			)
		);

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.character,
				(m)=> new NpcBattleCharacterWithCharacterController(this.game, m, this.model)
			)
		);

	}
}
