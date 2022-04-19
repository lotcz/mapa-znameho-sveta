import ControllerNode from "../node/ControllerNode";
import DirtyValue from "../node/DirtyValue";
import CollectionController from "./CollectionController";
import BattleCharacterController from "./BattleCharacterController";

const TRAVEL_SPEED = 1; // coordinates per second

export default class BattleController extends ControllerNode {

	/**
	 * @type BattleModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.charactersController = this.addChild(
			new CollectionController(this.game, this.model.characters, (model) => new BattleCharacterController(game, model))
		);

		/*
		this.helperMouseOverHandler = (point) => this.focusedHelper.set(point);
		this.helperMouseOutHandler = (point) => {
			if (this.focusedHelper.equalsTo(point))
				this.focusedHelper.set(null);
		};

		this.mouseMoveHandler = () => this.onMouseMove();
		this.zoomHandler = (param) => this.onZoom(param);
		*/

	}

	activateInternal() {
		/*
		this.game.addEventListener('helperMouseOver', this.helperMouseOverHandler);
		this.game.addEventListener('helperMouseOut', this.helperMouseOutHandler);

		this.game.controls.mouseCoordinates.addOnChangeListener(this.mouseMoveHandler);
		this.game.controls.addEventListener('zoom', this.zoomHandler);
*/

	}

	deactivateInternal() {
		/*
		this.game.removeEventListener('helperMouseOver', this.helperMouseOverHandler);
		this.game.removeEventListener('helperMouseOut', this.helperMouseOutHandler);

		this.game.controls.mouseCoordinates.removeOnChangeListener(this.mouseMoveHandler);
		this.game.controls.removeEventListener('zoom', this.zoomHandler);
*/

	}

	updateInternal(delta) {


		// dragging and scrolling
		if (!this.game.controls.mouseDownLeft.get()) {
			this.dragging = false;
		}
		if (!this.game.controls.mouseDownRight.get()) {
			this.scrolling = false;
		}
	}

	onMouseMove() {
		/*
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
		*/
	}

	onZoom(param) {
		//this.model.zoom.set(this.model.zoom.get() + (param * 0.1));
	}

}
