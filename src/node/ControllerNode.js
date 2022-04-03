import ActivatedTreeNode from "./ActivatedTreeNode";

export default class ControllerNode extends ActivatedTreeNode {

	/**
	 * @type GameModel
	 */
	game;

	/**
	 * @type ModelNode
	 */
	model;

	/**
	 * @param {GameModel} game
	 * @param {ModelNode} model
	 */
	constructor(game, model) {
		super();
		this.game = game;
		this.model = model;
	}

	update(delta) {
		if (!this.isActivated) {
			return;
		}
		this.updateInternal(delta);
		this.children.forEach((c) => c.update(delta));
	}

	updateInternal(delta) {

	}

}
