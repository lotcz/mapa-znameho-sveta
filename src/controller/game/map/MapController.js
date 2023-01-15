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
			this.game.mainLayerSize,
			'change',
			() => this.updateCornerCoordinates()
		);

		this.addAutoEvent(
			this.model.mapCenterCoordinates,
			'change',
			() => this.updateCornerCoordinates()
		);

		this.addAutoEvent(
			this.model.zoom,
			'change',
			() => this.updateCornerCoordinates()
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

		this.game.mainLayerMouseCoordinates.addOnChangeListener(this.mouseMoveHandler);
		this.game.controls.addEventListener('zoom', this.zoomHandler);

		this.map.addOnDirtyListener(this.resourcesChangedHandler);
	}

	deactivateInternal() {
		this.game.removeEventListener('helperMouseOver', this.helperMouseOverHandler);
		this.game.removeEventListener('helperMouseOut', this.helperMouseOutHandler);

		this.game.mainLayerMouseCoordinates.removeOnChangeListener(this.mouseMoveHandler);
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

	updateCornerCoordinates() {
		const center = this.game.mainLayerSize.multiply(0.5 / this.model.zoom.get());
		const corner = this.model.mapCenterCoordinates.subtract(center);
		this.model.mapCornerCoordinates.set(corner);
	}

	onMouseMove() {
		if (this.game.controls.mouseDownLeft.get()) {
			this.model.partyTraveling.set(false);
			if (this.dragging) {
				const mapCoords = this.model.mapCornerCoordinates.add(this.game.mainLayerMouseCoordinates.multiply(1 / this.model.zoom.get()));
				this.dragging.set(mapCoords);
			} else if (this.focusedHelper.isSet()) {
				this.dragging = this.focusedHelper.get();
			}
		}

		if (this.game.controls.mouseDownRight.get()) {
			this.model.partyTraveling.set(false);
			if (this.scrolling) {
				const offset = this.game.mainLayerMouseCoordinates.subtract(this.scrolling);
				const mapCoords = this.model.mapCenterCoordinates.subtract(offset.multiply(1 / this.model.zoom.get()));
				this.model.mapCenterCoordinates.set(mapCoords);
			}
			this.scrolling = this.game.mainLayerMouseCoordinates.clone();
		}
	}

	onZoom(param) {
		this.model.zoom.set(Math.max(this.model.zoom.get() + (param * -0.1), 0.05));
	}



}
