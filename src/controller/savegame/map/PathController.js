import ControllerNode from "../../basic/ControllerNode";
import Vector2 from "../../../model/basic/Vector2";

export default class PathController extends ControllerNode {

	/**
	 * @type PathModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(this.model.startLocationId, 'change', (param) => this.updateStartLocation(param));
		this.addAutoEvent(this.model.endLocationId, 'change', (param) => this.updateEndLocation(param));
		this.addAutoEvent(this.model, 'path-length', (length) => this.model.length.set(length));
		this.addAutoEvent(this.model, 'path-clicked', () => {
			this.runOnUpdate(() => this.game.saveGame.get().currentPathId.set(this.model.id.get()));
		});

	}

	activateInternal() {
		this.updateStartLocation();
		this.updateEndLocation();
		this.initWaypoints();
	}

	deactivateInternal() {
		this.updateLocationConnections(this.model.startLocation.get());
		this.updateLocationConnections(this.model.endLocation.get());
	}

	initWaypoints() {
		if (this.model.startLocation.isSet() && this.model.endLocation.isSet() && this.model.waypoints.isEmpty()) {
			const start = this.model.waypoints.add();
			start.coordinates.set(this.model.startLocation.get().coordinates);
			start.a.set(this.model.startLocation.get().coordinates.add(new Vector2(-50, -50)));
			start.b.set(this.model.startLocation.get().coordinates.add(new Vector2(50, 50)));
			const end = this.model.waypoints.add();
			end.coordinates.set(this.model.endLocation.get().coordinates);
			end.a.set(this.model.endLocation.get().coordinates.add(new Vector2(-50, -50)));
			end.b.set(this.model.endLocation.get().coordinates.add(new Vector2(50, 50)));
		}
	}

	loadLocation(id) {
		return this.game.resources.map.locations.getById(id);
	}

	updateStartLocation(param = null) {
		if (param && param.oldValue) {
			const oldLocation = this.loadLocation(param.oldValue);
			this.updateLocationConnections(oldLocation);
		}

		this.model.startLocation.set(null);
		const location = this.loadLocation(this.model.startLocationId.get());
		if (location) {
			this.model.startLocation.set(location);
			this.initWaypoints();
			this.updateLocationConnections(location);
		} else {
			console.log('location not found', this.model.startLocationId.get());
		}
	}

	updateEndLocation(param = null) {
		if (param && param.oldValue) {
			const oldLocation = this.loadLocation(param.oldValue);
			this.updateLocationConnections(oldLocation);
		}

		this.model.endLocation.set(null);
		const location = this.loadLocation(this.model.endLocationId.get());
		if (location) {
			this.model.endLocation.set(location);
			this.initWaypoints();
			this.updateLocationConnections(location);
		} else {
			console.log('location not found', this.model.endLocationId.get());
		}
	}

	updateLocationConnections(location) {
		if (!location) {
			console.log('no location to update');
			return;
		}
		location.updateConnections(this.game.resources.map.paths);
	}

}
