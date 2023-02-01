import ControllerNode from "./ControllerNode";

export default class ControllerWithSaveGame extends ControllerNode {

	/**
	 * @type SaveGameModel
	 */
	saveGame;

	/**
	 * @param {GameModel} game
	 * @param {ModelNode} model
	 * @param {SaveGameModel} saveGame
	 */
	constructor(game, model, saveGame = null) {
		super(game, model);
		if (!saveGame) {
			saveGame = this.game.saveGame.get();
		}
		this.saveGame = saveGame;

		if (!this.saveGame) {
			console.error('no SaveGameModel provided for controller!');
		}
	}

}
