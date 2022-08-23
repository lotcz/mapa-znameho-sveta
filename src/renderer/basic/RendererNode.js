import ActivatedTreeNode from "../../class/basic/ActivatedTreeNode";

export default class RendererNode extends ActivatedTreeNode {

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

	render() {
		if (!this.isActivated) {
			return;
		}
		if (!this.model.isDirty) {
			return;
		}
		this.renderInternal();
		this.children.forEach((c) => c.render());
		this.model.clean();
	}

	/**
	 * Override this
	 */
	renderInternal() {

	}

}
