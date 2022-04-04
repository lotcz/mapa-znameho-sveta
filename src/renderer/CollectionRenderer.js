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
	}

	activateInternal() {
		this.resetChildren();

		this.model.children.forEach((model) => this.createRenderer(model));

		this.model.children.addOnAddListener((model) => this.createRenderer(model));
		this.model.children.addOnRemoveListener((model) => this.removeRenderer(model));
	}

	deactivateInternal() {
		this.model.children.removeOnAddListener((model) => this.createRenderer(model));
		this.model.children.removeOnRemoveListener((model) => this.removeRenderer(model));
		this.resetChildren();
	}

	createRenderer(model) {
		const renderer = this.addChild(this.rendererFactory(model));
		return renderer;
	}

	removeRenderer(model) {
		const renderer = this.children.find((ch) => ch.model === model);
		this.removeChild(renderer);
	}

}
