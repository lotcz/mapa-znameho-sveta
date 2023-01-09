import ControllerNode from "./ControllerNode";

export default class ControllerSavedGameNode extends ControllerNode {

	/**
	 * @type SaveGameModel
	 */
	saveGame;

	/**
	 * @param {GameModel} game
	 * @param {ModelNode} model
	 * @param {SaveGameModel} saveGame
	 */
	constructor(game, model, saveGame) {
		super(game, model);
		this.saveGame = saveGame;
	}

}
