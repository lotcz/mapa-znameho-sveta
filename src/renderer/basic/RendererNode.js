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
		if (!this.model.isDirty) {
			return;
		}
		if (!this.isActivated) {
			return;
		}
		this.renderInternal();
		this.children.forEach((c) => c.render());
		if (this.isRoot()) {
			this.model.clean();
		}
	}

	/**
	 * Override this
	 */
	renderInternal() {}

}
