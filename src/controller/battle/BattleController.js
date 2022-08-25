import ControllerNode from "../basic/ControllerNode";
import DirtyValue from "../../model/basic/DirtyValue";
import CollectionController from "../basic/CollectionController";
import BattleCharacterController from "./BattleCharacterController";
import Pixies from "../../class/basic/Pixies";

const TRAVEL_SPEED = 1; // tiles per second

export default class BattleController extends ControllerNode {

	/**
	 * @type BattleModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;
		this.dragging = false;
		this.scrolling = false;

		this.charactersController = this.addChild(
			new CollectionController(this.game, this.model.characters, (model) => new BattleCharacterController(game, model))
		);

		/*
		this.helperMouseOverHandler = (point) => this.focusedHelper.set(point);
		this.helperMouseOutHandler = (point) => {
			if (this.focusedHelper.equalsTo(point))
				this.focusedHelper.set(null);
		};
	*/
		this.mouseMoveHandler = () => this.onMouseMove();
		this.zoomHandler = (param) => this.onZoom(param);
		this.clickHandler = (param) => this.onClick(param);

	}

	activateInternal() {
		this.model.coordinates.makeDirty();
		/*
		this.game.addEventListener('helperMouseOver', this.helperMouseOverHandler);
		this.game.addEventListener('helperMouseOut', this.helperMouseOutHandler);
*/
		this.game.controls.mouseCoordinates.addOnChangeListener(this.mouseMoveHandler);
		this.game.controls.addEventListener('zoom', this.zoomHandler);
		this.game.controls.addOnLeftClickListener(this.clickHandler);


	}

	deactivateInternal() {
		/*
		this.game.removeEventListener('helperMouseOver', this.helperMouseOverHandler);
		this.game.removeEventListener('helperMouseOut', this.helperMouseOutHandler);
*/
		this.game.controls.mouseCoordinates.removeOnChangeListener(this.mouseMoveHandler);
		this.game.controls.removeEventListener('zoom', this.zoomHandler);

		this.game.controls.removeOnLeftClickListener(this.clickHandler);
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
*/
		if (this.game.controls.mouseDownRight.get()) {
			if (this.scrolling) {
				const offset = this.game.controls.mouseCoordinates.subtract(this.scrolling);
				const mapCoords = this.model.coordinates.subtract(offset.multiply(1/this.model.zoom.get()));
				this.model.coordinates.set(mapCoords);
			}
			this.scrolling = this.game.controls.mouseCoordinates.clone();
		}

	}

	onZoom(param) {
		this.model.zoom.set(Math.max(this.model.zoom.get() + (param * -0.1), 0.05));
	}

	onClick() {
		//const xz = this.model.battleMap.screenCoordsToPosition(this.game.controls.mouseCoordinates);
		const corner = this.model.coordinates.subtract(this.game.viewBoxSize.multiply(0.5 / this.model.zoom.get()));
		const coords = corner.add(this.game.controls.mouseCoordinates.multiply(1/this.model.zoom.get()));
		const position = this.model.battleMap.screenCoordsToPosition(coords);
		const tile = position.round();
		//const character = Pixies.randomElement(this.model.characters.children.items);

		const occupant = this.model.characters.find((ch) => ch.position.round().equalsTo(tile));
		if (occupant) {
			this.model.selectedCharacter.set(occupant);
		} else {
			if (this.model.selectedCharacter.isSet()) {
				this.model.selectedCharacter.get().triggerEvent('go-to', tile);
			}
		}
	}
}
