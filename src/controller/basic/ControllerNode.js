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

		while (this.updateActions.length > 0) {
			const action = this.updateActions.shift();
			action(delta);
		}
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
