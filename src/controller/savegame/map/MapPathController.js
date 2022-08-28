import ControllerNode from "../../basic/ControllerNode";

const TRAVEL_SPEED = 40; // px per second

export default class MapPathController extends ControllerNode {

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
		this.addAutoEvent(this.model, 'path-marker-position', (pos) => {
			if (!this.model.isCurrentPath.get()) {
				return;
			}
			if (!this.game.saveGame.get().partyTraveling.get()) {
				return;
			}

			this.runOnUpdate(() => {
				const save = this.game.saveGame.get();
				save.partyCoordinates.set(pos);
				const center = this.game.viewBoxSize.multiply(0.5 * save.zoom.get());
				const corner = pos.subtract(center);
				save.coordinates.set(corner)
			});
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

	updateInternal(delta) {

		if (!this.model.isCurrentPath.get()) {
			return;
		}

		if (!this.game.saveGame.get().partyTraveling.get()) {
			return;
		}

		// travel

		let progress = this.model.pathProgress.get() + ((delta / 1000) * TRAVEL_SPEED * (this.game.saveGame.get().forward.get() ? 1 : -1));

		if (progress > this.model.length.get()) {
			progress = this.model.length.get();
			this.game.saveGame.get().forward.set(!this.game.saveGame.get().forward.get());
		}

		if (progress < 0) {
			progress = 0;
			this.game.saveGame.get().forward.set(!this.game.saveGame.get().forward.get());
		}

		this.model.pathProgress.set(progress);
		this.game.saveGame.get().pathProgress.set(progress);


	}

	initWaypoints() {
		if (this.model.startLocation.isSet() && this.model.endLocation.isSet() && this.model.waypoints.isEmpty()) {
			const start = this.model.waypoints.add();
			start.coordinates.set(this.model.startLocation.get().coordinates);
			start.a.set(this.model.startLocation.get().coordinates);
			start.b.set(this.model.endLocation.get().coordinates);
			const end = this.model.waypoints.add();
			end.coordinates.set(this.model.endLocation.get().coordinates);
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
