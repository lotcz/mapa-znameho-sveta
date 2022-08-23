import RendererNode from "./RendererNode";

export default class NullableNodeRenderer extends RendererNode {

	/**
	 * @type NullableNode
	 */
	model;

	constructor(game, model, rendererFactory) {
		super(game, model);
		this.model = model;

		this.rendererFactory = rendererFactory;
		this.onModelChangedHandler = () => this.updateRenderer();
	}

	activateInternal() {
		this.updateRenderer();
		this.model.addOnChangeListener(this.onModelChangedHandler);
	}

	deactivateInternal() {
		this.model.removeOnChangeListener(this.onModelChangedHandler);
		this.resetChildren();
	}

	updateRenderer() {
		this.resetChildren();
		if (this.model.isSet()) {
			this.addChild(this.rendererFactory(this.model.get()));
		}
	}

}
