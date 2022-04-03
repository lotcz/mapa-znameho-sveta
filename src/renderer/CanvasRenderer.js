import RendererNode from "../node/RendererNode";

export default class CanvasRenderer extends RendererNode {
	canvas;

	constructor(game, model, canvas) {
		super(game, model);
		this.canvas = canvas;
	}

}
