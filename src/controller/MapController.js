import ControllerNode from "../node/ControllerNode";
import DirtyValue from "../node/DirtyValue";

const TRAVEL_SPEED = 10; // px per second

export default class MapController extends ControllerNode {

	/**
	 * @type SaveGameModel
	 */
	saveGame;

	/**
	 * @type MapModel
	 */
	map;

	dragging;

	scrolling;

	/**
	 * @type DirtyValue
	 */
	focusedHelper;

	constructor(game, model) {
		super(game, model);

		this.saveGame = model;
		this.map = game.resources.map;

		this.dragging = false;
		this.scrolling = false;

		this.focusedHelper = new DirtyValue(null);

		this.helperMouseOverHandler = (point) => this.focusedHelper.set(point);
		this.helperMouseOutHandler = (point) => {
			if (this.focusedHelper.equalsTo(point))
				this.focusedHelper.set(null);
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

		this.map.locations.children.forEach(this.locationAddedHandler);
		this.map.locations.children.addOnAddListener(this.locationAddedHandler);
		this.map.locations.children.addOnRemoveListener(this.locationRemovedHandler);
	}

	deactivateInternal() {
		this.game.removeEventListener('helperMouseOver', this.helperMouseOverHandler);
		this.game.removeEventListener('helperMouseOut', this.helperMouseOutHandler);

		this.game.controls.mouseCoordinates.removeOnChangeListener(this.mouseMoveHandler);
		this.game.controls.removeEventListener('zoom', this.zoomHandler);

		this.map.locations.children.removeOnAddListener(this.locationAddedHandler);
		this.map.locations.children.removeOnRemoveListener(this.locationRemovedHandler);
	}

	updateInternal(delta) {
		super.updateInternal(delta);

		// move marker
		const path = this.map.paths.first();
		let progress = this.saveGame.pathProgress.get() + ((delta / 1000) * TRAVEL_SPEED * (this.saveGame.forward.get() ? 1 : -1));

		if (progress > path.length.get()) {
			progress = (2 * path.length.get()) - progress;
			this.saveGame.forward.set(!this.saveGame.forward.get());
		}

		if (progress < 0) {
			progress = -progress;
			this.saveGame.forward.set(!this.saveGame.forward.get());
		}

		this.saveGame.pathProgress.set(progress);

		// dragging and scrolling
		if (!this.game.controls.mouseDownLeft.get()) {
			this.dragging = false;
		}
		if (!this.game.controls.mouseDownRight.get()) {
			this.scrolling = false;
		}
	}

	onMouseMove() {
		if (this.game.controls.mouseDownLeft.get()) {
			if (this.dragging) {
				const mapCoords = this.model.coordinates.add(this.game.controls.mouseCoordinates.multiply(this.model.zoom.get()));
				this.dragging.set(mapCoords);
			} else if (this.focusedHelper.isSet()) {
				this.dragging = this.focusedHelper.get();
			}
		}

		if (this.game.controls.mouseDownRight.get()) {
			if (this.scrolling) {
				const offset = this.game.controls.mouseCoordinates.subtract(this.scrolling);
				const mapCoords = this.model.coordinates.subtract(offset.multiply(this.model.zoom.get()));
				this.model.coordinates.set(mapCoords);
				this.scrolling = this.game.controls.mouseCoordinates.clone();
			} else {
				this.scrolling = this.game.controls.mouseCoordinates.clone();
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
		const path = this.game.resources.map.paths.getById(conn.pathId.get());
		const point = conn.forward.get() ? path.waypoints.first().coordinates : path.waypoints.last().coordinates;
		point.set(location.coordinates);
	}

	onLocationChanged(location) {
		location.connections.children.forEach((conn) => this.updatePoint(location, conn));
	}

}
