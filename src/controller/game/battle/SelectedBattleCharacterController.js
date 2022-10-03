import ControllerNode from "../../basic/ControllerNode";

export default class SelectedBattleCharacterController extends ControllerNode {

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
				const save = this.game.saveGame.get();
				const battle = save.currentBattle.get();
				const battleMap = battle.battleMap.get();
				const coords = battleMap.positionToScreenCoords(this.model.position);
				battle.coordinates.set(coords);
			}
		);

	}

}
