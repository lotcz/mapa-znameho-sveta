import ControllerWithSaveGame from "./ControllerWithSaveGame";

export default class ControllerWithBattle extends ControllerWithSaveGame {

	/**
	 * @type BattleModel
	 */
	battle;

	/**
	 * @type BattleMapModel
	 */
	battleMap;

	/**
	 * @param {GameModel} game
	 * @param {ModelNode} model
	 * @param {BattleModel} battle
	 */
	constructor(game, model, battle = null) {
		super(game, model);
		if (!battle) {
			battle = this.saveGame.currentBattle.get();
		}
		this.battle = battle;

		if (!this.battle) {
			console.error('no BattleModel provided for controller!');
		}
		this.battleMap = this.battle.battleMap.get();

		if (!this.battleMap) {
			console.error('no BattleMapModel provided for controller!');
		}
	}

}
