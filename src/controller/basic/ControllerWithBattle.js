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
	 * @param {BattleMapModel} battleMap
	 */
	constructor(game, model, battle = null, battleMap = null) {
		super(game, model);
		if (!battle) {
			battle = this.saveGame.currentBattle.get();
		}
		this.battle = battle;

		if (!this.battle) {
			console.error('no BattleModel provided for controller!');
		}

		if (!battleMap) {
			battleMap = this.battle.battleMap.get();
		}
		this.battleMap = battleMap;

		if (!this.battleMap) {
			console.error('no BattleMapModel provided for controller!');
		}
	}

}
