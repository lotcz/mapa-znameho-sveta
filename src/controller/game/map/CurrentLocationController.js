import CollectionController from "../../basic/CollectionController";
import ConnectionController from "./ConnectionController";
import ControllerWithSaveGame from "../../basic/ControllerWithSaveGame";

export default class CurrentLocationController extends ControllerWithSaveGame {

	/**
	 * @type LocationModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(new CollectionController(this.game, this.model.connections, (m) => new ConnectionController(this.game, m)));

	}

	activateInternal() {
		this.saveGame.currentPathId.set(null);
		this.saveGame.partyCoordinates.set(this.model.coordinates);
		this.saveGame.partyTraveling.set(false);
	}

}

