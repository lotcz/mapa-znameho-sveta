import ControllerNode from "../../basic/ControllerNode";
import DirtyValue from "../../../model/basic/DirtyValue";
import CollectionController from "../../basic/CollectionController";
import PathController from "./PathController";
import LocationController from "./LocationController";
import NullableNodeController from "../../basic/NullableNodeController";
import CurrentLocationController from "./CurrentLocationController";
import CurrentPathController from "./CurrentPathController";

export default class MapController extends ControllerNode {

	/**
	 * @type SaveGameModel
	 */
	model;

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

	constructor(game, saveGame) {
		super(game, saveGame);

		this.model = saveGame;
		this.map = game.resources.map;

		this.dragging = false;
		this.scrolling = false;

		this.focusedHelper = new DirtyValue(null);

		this.pathsController = new CollectionController(this.game, this.game.resources.map.paths, (m) => new PathController(this.game, m));
		this.addChild(this.pathsController);

		this.locationsController = new CollectionController(this.game, this.game.resources.map.locations, (m) => new LocationController(this.game, m));
		this.addChild(this.locationsController);

		this.addChild(new NullableNodeController(this.game, this.model.currentPath, (m) => new CurrentPathController(this.game, m)));
		this.addChild(new NullableNodeController(this.game, this.model.currentLocation, (m) => new CurrentLocationController(this.game, m)));

		this.addAutoEvent(
			this.model.currentPathId,
			'change',
			() => {
				this.runOnUpdate(() => this.model.currentPath.set(this.map.paths.getById(this.model.currentPathId.get())));
			},
			true
		);

		this.addAutoEvent(
			this.model.currentLocationId,
			'change',
			() => {
				this.runOnUpdate(() => this.model.currentLocation.set(this.map.locations.getById(this.model.currentLocationId.get())));
			},
			true
		);

		this.helperMouseOverHandler = (point) => this.focusedHelper.set(point);
		this.helperMouseOutHandler = (point) => {
			if (this.focusedHelper.equalsTo(point)) {
				this.focusedHelper.set(null);
			}
		};

		this.mouseMoveHandler = () => this.runOnUpdate(() => this.onMouseMove());
		this.zoomHandler = (param) => this.onZoom(param);

		this.resourcesChangedHandler = () => {
			this.model.makeDirty();
		};
	}

	activateInternal() {
		this.game.addEventListener('helperMouseOver', this.helperMouseOverHandler);
		this.game.addEventListener('helperMouseOut', this.helperMouseOutHandler);

		this.game.controls.mouseCoordinates.addOnChangeListener(this.mouseMoveHandler);
		this.game.controls.addEventListener('zoom', this.zoomHandler);

		this.map.addOnDirtyListener(this.resourcesChangedHandler);
	}

	deactivateInternal() {
		this.game.removeEventListener('helperMouseOver', this.helperMouseOverHandler);
		this.game.removeEventListener('helperMouseOut', this.helperMouseOutHandler);

		this.game.controls.mouseCoordinates.removeOnChangeListener(this.mouseMoveHandler);
		this.game.controls.removeEventListener('zoom', this.zoomHandler);

		this.map.removeOnDirtyListener(this.resourcesChangedHandler);
	}

	updateInternal(delta) {
		super.updateInternal(delta);

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
			this.model.partyTraveling.set(false);
			if (this.dragging) {
				const mapCoords = this.model.coordinates.add(this.game.controls.mouseCoordinates.multiply(this.model.zoom.get()));
				this.dragging.set(mapCoords);
			} else if (this.focusedHelper.isSet()) {
				this.dragging = this.focusedHelper.get();
			}
		}

		if (this.game.controls.mouseDownRight.get()) {
			this.model.partyTraveling.set(false);
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

}
