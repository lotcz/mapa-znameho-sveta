import ControllerNode from "../node/ControllerNode";

const TRAVEL_SPEED = 10; // px per second

export default class MapController extends ControllerNode {

	/**
	 * @type MapModel
	 */
	model;

	dragging;

	scrolling;

	constructor(game, model) {
		super(game, model);

		this.model = model;
		this.dragging = false;
		this.scrolling = false;

		this.helperMouseOverHandler = (point) => this.model.focusedHelper.set(point);
		this.helperMouseOutHandler = (point) => {
			if (this.model.focusedHelper.equalsTo(point))
				this.model.focusedHelper.set(null);
		};

		this.mouseMoveHandler = () => this.onMouseMove();
		this.zoomHandler = (param) => this.onZoom(param);

		this.locationAddedHandler = (param) => this.onLocationAdded(param);
		this.locationRemovedHandler = (param) => this.onLocationRemoved(param);
		this.locationChangedHandler = (param) => this.onLocationChanged(param);

	}

	activateInternal() {
		this.game.addEventListener('helperMouseOver', this.helperMouseOverHandler);
		this.game.addEventListener('helperMouseOut', this.helperMouseOutHandler);

		this.game.controls.mouseCoordinates.addOnChangeListener(this.mouseMoveHandler);
		this.game.controls.addEventListener('zoom', this.zoomHandler);

		this.model.locations.children.forEach(this.locationAddedHandler);
		this.model.locations.children.addOnAddListener(this.locationAddedHandler);
		this.model.locations.children.addOnRemoveListener(this.locationRemovedHandler);
	}

	deactivateInternal() {
		this.game.removeEventListener('helperMouseOver', this.helperMouseOverHandler);
		this.game.removeEventListener('helperMouseOut', this.helperMouseOutHandler);

		this.game.controls.mouseCoordinates.removeOnChangeListener(this.mouseMoveHandler);
		this.game.controls.removeEventListener('zoom', this.zoomHandler);

		this.model.locations.children.removeOnAddListener(this.locationAddedHandler);
		this.model.locations.children.removeOnRemoveListener(this.locationRemovedHandler);
	}

	updateInternal(delta) {
		super.updateInternal(delta);

		// move marker
		const path = this.game.map.paths.first();
		let progress = path.pathProgress.get() + ((delta / 1000) * TRAVEL_SPEED * (path.forward.get() ? 1 : -1));

		if (progress > path.length.get()) {
			progress = (2 * path.length.get()) - progress;
			path.forward.set(!path.forward.get());
		}

		if (progress < 0) {
			progress = -progress;
			path.forward.set(!path.forward.get());
		}

		path.pathProgress.set(progress);

		// dragging and scrolling
		if (!this.game.controls.mouseDownLeft.get()) {
			this.dragging = this.scrolling = false;
		}
	}

	onMouseMove() {
		if (this.game.controls.mouseDownLeft.get()) {
			if (this.dragging) {
				const mapCoords = this.model.coordinates.add(this.game.controls.mouseCoordinates.multiply(this.model.zoom.get()));
				this.dragging.set(mapCoords);
			} else if (this.scrolling) {
				const offset = this.game.controls.mouseCoordinates.subtract(this.scrolling);
				const mapCoords = this.model.coordinates.subtract(offset.multiply(this.model.zoom.get()));
				this.model.coordinates.set(mapCoords);
				this.scrolling = this.game.controls.mouseCoordinates.clone();
			} else {
				if (this.model.focusedHelper.isSet()) {
					this.dragging = this.model.focusedHelper.get();
				} else {
					this.scrolling = this.game.controls.mouseCoordinates.clone();
				}
			}
		}
	}

	onZoom(param) {
		this.model.zoom.set(this.model.zoom.get() + (param * 0.1));
	}

	onLocationAdded(location) {
		location.addEventListener('change', this.locationChangedHandler);
	}

	onLocationRemoved(location) {
		location.removeEventListener('change', this.locationChangedHandler);
	}

	updatePoint(location, conn) {
		const path = this.model.paths.getById(conn.pathId.get());
		const point = conn.forward.get() ? path.waypoints.first().coordinates : path.waypoints.last().coordinates;
		point.set(location.coordinates);
	}

	onLocationChanged(location) {
		location.connections.children.forEach((conn) => this.updatePoint(location, conn));
	}

}
