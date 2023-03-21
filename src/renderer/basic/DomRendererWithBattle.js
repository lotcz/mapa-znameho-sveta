import DomRendererWithSaveGame from "./DomRendererWithSaveGame";

export default class DomRendererWithBattle extends DomRendererWithSaveGame {

	constructor(game, model, dom) {
		super(game, model, dom);

		this.battle = this.saveGame.currentBattle.get();
		this.battleMap = this.battle.battleMap.get();

		if (!this.battleMap) {
			console.error('no BattleMapModel provided for renderer!');
		}
	}


}
