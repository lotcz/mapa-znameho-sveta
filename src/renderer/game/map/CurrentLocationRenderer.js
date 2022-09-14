import SvgRenderer from "../../basic/SvgRenderer";
import CollectionRenderer from "../../basic/CollectionRenderer";
import ConnectionRenderer from "./ConnectionRenderer";

export default class CurrentLocationRenderer extends SvgRenderer {

	/**
	 * @type LocationModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);
		this.model = model;

		this.addChild(new CollectionRenderer(this.game, this.model.connections, (m) => new ConnectionRenderer(this.game, m, this.draw)));
	}

}
