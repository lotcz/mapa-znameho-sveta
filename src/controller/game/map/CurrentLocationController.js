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

		this.addAutoEvent(
			this.model.biotopeId,
			'change',
			() => {
				this.model.biotope.set(this.game.resources.map.biotopes.getById(this.model.biotopeId.get()));
			},
			true
		);
	}

	activateInternal() {
		this.game.saveGame.get().currentPathId.set(0);
		this.game.saveGame.get().partyCoordinates.set(this.model.coordinates);
		this.game.saveGame.get().partyTraveling.set(false);
	}

}

