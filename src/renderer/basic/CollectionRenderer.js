import RendererNode from "./RendererNode";

export default class CollectionRenderer extends RendererNode {

	/**
	 * @type ModelNodeCollection
	 */
	model;

	constructor(game, model, rendererFactory) {
		super(game, model);
		this.model = model;

		this.rendererFactory = rendererFactory;

		this.addAutoEvent(
			this.model.children,
			'add',
			(model) => {
				this.addRenderer(model);
			}
		);

		this.addAutoEvent(
			this.model.children,
			'remove',
			(model) => {
				const renderer = this.children.find((ch) => ch.model === model);
				this.removeChild(renderer);
			}
		);

		this.addAutoEvent(
			this.model.children,
			'insert',
			() => {
				this.resetChildren();
				this.model.forEach((model) => {
					this.addRenderer(model);
				});
			},
			true
		);
	}

	addRenderer(model) {
		return this.addChild(this.rendererFactory(model));
	}

}
