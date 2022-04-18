import ActivatedTreeNode from "./ActivatedTreeNode";

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
	 * @type boolean
	 */
	alwaysRender;

	/**
	 * @param {GameModel} game
	 * @param {ModelNode} model
	 */
	constructor(game, model) {
		super();
		this.game = game;
		this.model = model;
		this.alwaysRender = false;
	}

	render() {
		if (!this.isActivated) {
			return;
		}
		if (!(this.model.isDirty || this.alwaysRender)) {
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
