import DomRenderer from "../../basic/DomRenderer";
import ImageToCanvasRenderer from "../../basic/ImageToCanvasRenderer";

export default class SequenceStepBackgroundRenderer extends DomRenderer {

	/**
	 * @type SequenceStepBackgroundModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(
			new ImageToCanvasRenderer(
				this.game,
				this.model.renderingImage,
				this.dom
			)
		);

	}

}
