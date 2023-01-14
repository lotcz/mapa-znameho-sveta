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
	 * @type array[() => any]
	 */
	onRenderActions;

	/**
	 * @param {GameModel} game
	 * @param {ModelNode} model
	 */
	constructor(game, model) {
		super();
		this.game = game;
		this.model = model;

		this.onRenderActions = null;
	}

	render() {
		if (!this.model.isDirty) {
			return;
		}
		if (!this.isActivated) {
			return;
		}
		if (this.onRenderActions) {
			while (this.onRenderActions.length > 0) {
				const action = this.onRenderActions.shift();
				action();
			}
			this.onRenderActions = null;
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

	runOnRender(action) {
		if (!this.onRenderActions) {
			this.onRenderActions = [];
		}
		this.onRenderActions.push(action);
		this.model.makeDirty();
	}
}
