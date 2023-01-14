import RendererNode from "./RendererNode";

export default class NullableNodeRenderer extends RendererNode {

	/**
	 * @type NullableNode
	 */
	model;

	constructor(game, model, rendererFactory, defaultRendererFactory = null) {
		super(game, model);
		this.model = model;

		this.rendererFactory = rendererFactory;
		this.defaultRendererFactory = defaultRendererFactory;

		this.addAutoEvent(
			this.model,
			'change',
			() => this.updateRenderer(),
			true
		);
	}

	updateRenderer() {
		this.resetChildren();
		if (this.model.isSet()) {
			this.addChild(this.rendererFactory(this.model.get()));
		} else if (this.defaultRendererFactory) {
			this.addChild(this.defaultRendererFactory());
		}
	}

}
