import ControllerNode from "../../basic/ControllerNode";
import CollectionController from "../../basic/CollectionController";
import BattleCharacterController from "./BattleCharacterController";
import NullableNodeController from "../../basic/NullableNodeController";
import BattleMapController from "./BattleMapController";

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

		this.addChild(
			new CollectionController(
				this.game,
				this.model.characters,
				(m) => new BattleCharacterController(game, m)
			)
		);

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.battleMap,
				(m) => new BattleMapController(game, m)
			)
		);

		this.mouseMoveHandler = () => this.onMouseMove();
		this.zoomHandler = (param) => this.onZoom(param);
		this.clickHandler = (param) => this.onClick(param);

		this.addAutoEvent(
			this.model.battleMapId,
			'change',
			() => {
				this.model.battleMap.set(this.game.resources.map.battleMaps.getById(this.model.battleMapId));
			},
			true
		);
	}

	activateInternal() {
		this.model.coordinates.makeDirty();

		this.game.controls.mouseCoordinates.addOnChangeListener(this.mouseMoveHandler);
		this.game.controls.addEventListener('zoom', this.zoomHandler);
		this.game.controls.addOnLeftClickListener(this.clickHandler);


	}

	deactivateInternal() {
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

		if (this.model.isMouseOver.get() === false) {
			return;
		}

		const corner = this.model.coordinates.subtract(this.game.viewBoxSize.multiply(0.5 / this.model.zoom.get()));
		const coords = corner.add(this.game.controls.mouseCoordinates.multiply(1/this.model.zoom.get()));
		const position = this.model.battleMap.get().screenCoordsToPosition(coords);
		const tile = position.round();

		const occupant = this.model.characters.find((ch) => ch.position.round().equalsTo(tile));
		if (occupant) {
			this.switchCharacter(occupant.characterId.get());
		} else {
			const character = this.getSelectedBattleCharacter()
			if (character) {
				character.triggerEvent('go-to', tile);
			}
		}
	}

	switchCharacter(characterId) {
		this.game.saveGame.get().party.selectedCharacterId.set(characterId);
	}

	getBattleCharacter(characterId) {
		if (!characterId) {
			return null;
		}
		return this.model.characters.find((ch) => ch.characterId.equalsTo(characterId));
	}

	getSelectedBattleCharacter() {
		const selected = this.game.saveGame.get().party.selectedCharacterId.get();
		return this.getBattleCharacter(selected);
	}

}
