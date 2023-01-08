import ControllerNode from "../../basic/ControllerNode";

export default class LocationController extends ControllerNode {

	/**
	 * @type LocationModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		if (this.model.coordinates.size() === 0) {
			this.model.coordinates.set(this.game.saveGame.get().mapCenterCoordinates);
			this.updateWaypoints();
		}

		this.addAutoEvent(this.model.coordinates, 'change', () => this.updateWaypoints());
	}

	activateInternal() {
		this.updateWaypoints();
	}

	updateWaypoint(conn) {
		const path = this.game.resources.map.paths.getById(conn.pathId.get());
		if (!path) {
			console.log('path not found', conn.pathId.get());
			return;
		}
		if (path.waypoints.count() <= 0) return;
		const point = conn.forward.get() ? path.waypoints.first().coordinates : path.waypoints.last().coordinates;
		point.set(this.model.coordinates);
	}

	updateWaypoints() {
		//console.log('updating waypoints', this.model.connections);
		this.model.connections.forEach((conn) => this.updateWaypoint(conn));
	}

}
