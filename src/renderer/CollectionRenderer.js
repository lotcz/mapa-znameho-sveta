import RendererNode from "../node/RendererNode";

export default class CollectionRenderer extends RendererNode {

	/**
	 * @type ModelNodeCollection
	 */
	model;

	constructor(game, model, rendererFactory) {
		super(game, model);
		this.model = model;

		this.rendererFactory = rendererFactory;
		this.onModelAddedHandler = (model) => this.createRenderer(model);
		this.onModelRemovedHandler = (model) => this.removeRenderer(model);
	}

	activateInternal() {
		this.resetChildren();

		this.model.children.forEach((model) => this.createRenderer(model).activate());

		this.model.children.addOnAddListener(this.onModelAddedHandler);
		this.model.children.addOnRemoveListener(this.onModelRemovedHandler);
	}

	deactivateInternal() {
		this.model.children.removeOnAddListener(this.onModelAddedHandler);
		this.model.children.removeOnRemoveListener(this.onModelRemovedHandler);
		this.resetChildren();
	}

	createRenderer(model) {
		return this.addChild(this.rendererFactory(model));
	}

	removeRenderer(model) {
		const renderer = this.children.find((ch) => ch.model === model);
		this.removeChild(renderer);
	}

}
