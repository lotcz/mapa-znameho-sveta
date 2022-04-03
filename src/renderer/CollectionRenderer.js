import RendererNode from "../node/RendererNode";

export default class CollectionRenderer extends RendererNode {

	/**
	 * @type ModelCollectionNode
	 */
	model;

	constructor(game, model, rendererFactory) {
		super(game, model);
		this.model = model;

		this.rendererFactory = rendererFactory;

		this.model.children.addOnAddListener((model) => this.createRenderer(model));
		this.model.children.addOnRemoveListener((model) => this.removeRenderer(model));
	}

	createRenderer(model) {
		this.addChild(this.rendererFactory(model));
	}

	removeRenderer(model) {
		const renderer = this.children.find((ch) => ch.model === model);
		this.removeChild(renderer);
	}

}
