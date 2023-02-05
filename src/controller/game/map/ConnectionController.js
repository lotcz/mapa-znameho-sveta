import ControllerWithSaveGame from "../../basic/ControllerWithSaveGame";

export default class ConnectionController extends ControllerWithSaveGame {

	/**
	 * @type ConnectionModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(this.model.pathId, 'change', () => this.updateDirection(), true);
		this.addAutoEvent(this.model.forward, 'change', () => this.updateDirection());
		this.addAutoEvent(this.model, 'connection-selected', (p) => this.connectionSelected(p));
	}

	updateDirection() {
		const path = this.game.resources.map.paths.getById(this.model.pathId.get());
		if (!path) {
			console.log('path not found', this.model.pathId.get());
			return;
		}
		if (path.waypoints.count() < 2) {
			console.log('path has not enough waypoints', path.waypoints);
			return;
		}
		const nextWaypoint = this.model.forward.get() ? path.waypoints.get(0) : path.waypoints.get(path.waypoints.count() - 1);
		const point = this.model.forward.get() ? nextWaypoint.a : nextWaypoint.b;
		this.model.direction.set(point);
	}

	connectionSelected(connection) {
		const path = this.game.resources.map.paths.getById(connection.pathId.get());
		this.saveGame.forward.set(connection.forward.get());
		this.saveGame.pathProgress.set(connection.forward.get() ? 0 : path.length.get());
		this.saveGame.currentPathId.set(path.id.get());
		this.saveGame.partyTraveling.set(true);
	}
}

