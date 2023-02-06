import SvgRenderer from "./SvgRenderer";

export default class SvgRendererWithBattle extends SvgRenderer {

	/**
	 * @type SaveGameModel
	 */
	saveGame;

	/**
	 * @type BattleModel
	 */
	battle;

	/**
	 * @type BattleMapModel
	 */
	battleMap;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.saveGame = this.game.saveGame.get();
		this.battle = this.saveGame.currentBattle.get();
		this.battleMap = this.battle.battleMap.get();

		if (!this.battleMap) {
			console.error('no BattleMapModel provided for renderer!');
		}
	}


}
