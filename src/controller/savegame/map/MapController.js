import ControllerNode from "../../basic/ControllerNode";
import DirtyValue from "../../../model/basic/DirtyValue";
import CollectionController from "../../basic/CollectionController";
import MapPathController from "./MapPathController";
import MapLocationController from "./MapLocationController";

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

	constructor(game, saveGame) {
		super(game, saveGame);

		this.saveGame = saveGame;
		this.map = game.resources.map;

		this.dragging = false;
		this.scrolling = false;

		this.focusedHelper = new DirtyValue(null);

		this.pathsController = new CollectionController(this.game, this.game.resources.map.paths, (m) => new MapPathController(this.game, m));
		this.addChild(this.pathsController);

		this.locationsController = new CollectionController(this.game, this.game.resources.map.locations, (m) => new MapLocationController(this.game, m));
		this.addChild(this.locationsController);

		this.addAutoEvent(
			this.saveGame.currentPathId,
			'change',
			() => this.saveGame.currentPath.set(this.map.paths.getById(this.saveGame.currentPathId.get())),
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
			if (this.dragging) {
				const mapCoords = this.saveGame.coordinates.add(this.game.controls.mouseCoordinates.multiply(this.saveGame.zoom.get()));
				this.dragging.set(mapCoords);
			} else if (this.focusedHelper.isSet()) {
				this.dragging = this.focusedHelper.get();
			}
		}

		if (this.game.controls.mouseDownRight.get()) {
			if (this.scrolling) {
				const offset = this.game.controls.mouseCoordinates.subtract(this.scrolling);
				const mapCoords = this.saveGame.coordinates.subtract(offset.multiply(this.saveGame.zoom.get()));
				this.saveGame.coordinates.set(mapCoords);
				this.scrolling = this.game.controls.mouseCoordinates.clone();
			} else {
				this.scrolling = this.game.controls.mouseCoordinates.clone();
			}
		}
	}

	onZoom(param) {
		this.saveGame.zoom.set(this.saveGame.zoom.get() + (param * 0.1));
	}

}
