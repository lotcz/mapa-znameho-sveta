import ControllerNode from "../../basic/ControllerNode";

export default class ConnectionController extends ControllerNode {

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
		const nextWaypoint = this.model.forward.get() ? path.waypoints.get(1) : path.waypoints.get(path.waypoints.count() - 2);

		const next = nextWaypoint.coordinates;

		this.model.direction.set(next);
	}

	connectionSelected(connection) {
		const path = this.game.resources.map.paths.getById(connection.pathId.get());
		const save = this.game.saveGame.get();
		save.forward.set(connection.forward.get());
		save.pathProgress.set(connection.forward.get() ? 0 : path.length.get());
		save.currentPathId.set(path.id.get());
		save.partyTraveling.set(true);
	}
}

