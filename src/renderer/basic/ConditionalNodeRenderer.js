import RendererNode from "./RendererNode";

export default class ConditionalNodeRenderer extends RendererNode {

	/**
	 * @type DirtyValue
	 */
	model;

	constructor(game, model, condition, rendererFactory) {
		super(game, model);
		this.model = model;
		this.condition = condition;
		this.rendererFactory = rendererFactory;
		this.renderer = null;

		this.addAutoEvent(
			this.model,
			'change',
			() => this.updateRenderer(),
			true
		)
	}

	updateRenderer() {
		this.renderer = null;
		this.resetChildren();
		if (this.condition()) {
			this.renderer = this.addChild(this.rendererFactory());
		}
	}

	isModelDirty() {
		if (!this.renderer) return false;
		return this.renderer.model.isDirty;
	}
}
