import ControllerNode from "../../basic/ControllerNode";

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
	}

	activateInternal() {
		this.updateStartLocation();
		this.updateEndLocation();
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
