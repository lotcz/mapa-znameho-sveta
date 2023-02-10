import DomRenderer from "./DomRenderer";

export default class DomRendererWithSaveGame extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	saveGame;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.saveGame = this.game.saveGame.get();

		if (!this.saveGame) {
			console.error('no SaveGameModel provided for renderer!');
		}
	}


}
