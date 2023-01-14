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

	render() {
		if (!this.isActivated) {
			return;
		}
		if (this.renderer) {
			this.renderer.render();
		}
	}

	updateRenderer() {
		this.resetChildren();
		if (this.model.isSet()) {
			this.renderer = this.addChild(this.rendererFactory(this.model.get()));
		} else if (this.defaultRendererFactory) {
			this.renderer = this.addChild(this.defaultRendererFactory());
		}
	}

}
