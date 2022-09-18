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

		this.addAutoEvent(
			this.model,
			'change',
			() => this.updateRenderer(),
			true
		)
	}

	updateRenderer() {
		this.resetChildren();
		if (this.condition()) {
			this.addChild(this.rendererFactory());
		}
	}

}
