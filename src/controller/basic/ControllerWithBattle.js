import ControllerWithSaveGame from "./ControllerWithSaveGame";

export default class ControllerWithBattle extends ControllerWithSaveGame {

	/**
	 * @type BattleModel
	 */
	battle;

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
	}

}