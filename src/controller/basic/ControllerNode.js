import ActivatedTreeNode from "../../class/basic/ActivatedTreeNode";

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
	 * @type array[(delta) => any]
	 */
	updateActions;

	/**
	 * @param {GameModel} game
	 * @param {ModelNode} model
	 */
	constructor(game, model) {
		super();
		this.game = game;
		this.model = model;

		this.updateActions = [];
	}

	update(delta) {
		if (!this.isActivated) {
			return;
		}

		this.updateActions.forEach((action) => action(delta));
		this.updateActions = [];

		this.updateInternal(delta);
		this.children.forEach((c) => c.update(delta));
	}

	updateInternal(delta) {

	}

	/**
	 *
	 * @param action (delta) => any
	 */
	runOnUpdate(action) {
		this.updateActions.push(action);
	}

}
