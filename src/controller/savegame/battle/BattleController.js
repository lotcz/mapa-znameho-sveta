import ControllerNode from "../../basic/ControllerNode";
import CollectionController from "../../basic/CollectionController";
import BattleCharacterController from "./BattleCharacterController";
import BattleCharacterModel from "../../../model/savegame/battle/BattleCharacterModel";
import Pixies from "../../../class/basic/Pixies";
import Vector2 from "../../../model/basic/Vector2";

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

		this.mouseMoveHandler = () => this.onMouseMove();
		this.zoomHandler = (param) => this.onZoom(param);
		this.clickHandler = (param) => this.onClick(param);

		this.initializeBattle();

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
		//const xz = this.model.battleMap.screenCoordsToPosition(this.game.controls.mouseCoordinates);
		const corner = this.model.coordinates.subtract(this.game.viewBoxSize.multiply(0.5 / this.model.zoom.get()));
		const coords = corner.add(this.game.controls.mouseCoordinates.multiply(1/this.model.zoom.get()));
		const position = this.model.battleMap.screenCoordsToPosition(coords);
		const tile = position.round();
		//const character = Pixies.randomElement(this.model.characters.children.items);

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

	initializeBattle() {
		const battleMapId = this.model.battleMapId.get();
		const map = this.model.battleMap = this.game.resources.map.battleMaps.getById(battleMapId);

		const slots = this.game.saveGame.get().party.slots;
		slots.forEach((slot) => {
			const character = new BattleCharacterModel();
			character.characterId.set(slot.characterId.get());
			const position = map.start.add(new Vector2(Pixies.random(-5, 5), Pixies.random(-5, 5))).round();
			console.log(position);
			character.position.set(position);
			this.model.characters.add(character);
		});
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
