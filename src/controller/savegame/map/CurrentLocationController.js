import ControllerNode from "../../basic/ControllerNode";
import CollectionController from "../../basic/CollectionController";
import ConnectionController from "./ConnectionController";

export default class CurrentLocationController extends ControllerNode {

	/**
	 * @type LocationModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(new CollectionController(this.game, this.model.connections, (m) => new ConnectionController(this.game, m)));
	}

}

