import ControllerNode from "../basic/ControllerNode";
import NullableNodeController from "../basic/NullableNodeController";
import EditorBattleMapController from "./EditorBattleMapController";
import BattleSpriteModel from "../../model/game/battle/BattleSpriteModel";
import {MODE_ACTION_ADD, MODE_ACTION_DELETE} from "../../model/editor/BattleEditorModel";

export default class EditorBattleController extends ControllerNode {

	/**
	 * @type BattleModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.battleMap,
				(m) => new EditorBattleMapController(this.game,	m)
			)
		);

		this.addAutoEvent(
			this.game.controls,
			'left-click',
			() => {
				this.onClick();
			}
		);

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

	onClick() {
		if (this.model.isMouseOver.get() === false) {
			return;
		}

		const corner = this.model.coordinates.subtract(this.game.viewBoxSize.multiply(0.5 / this.model.zoom.get()));
		const coords = corner.add(this.game.controls.mouseCoordinates.multiply(1/this.model.zoom.get()));
		const position = this.model.battleMap.get().screenCoordsToPosition(coords);
		const tile = position.round();

		const sprite = this.model.battleMap.get().sprites.find((ch) => ch.position.round().equalsTo(tile));
		if (sprite) {
			if (this.game.editor.battleEditor.get().modeAction.equalsTo(MODE_ACTION_DELETE)) {
				console.log('deleting sprite', sprite);
				this.model.battleMap.get().sprites.remove(sprite);
			}
		} else {
			const id = this.game.editor.battleEditor.get().spriteId.get();
			if (id && this.game.editor.battleEditor.get().modeAction.equalsTo(MODE_ACTION_ADD)) {
				const battleSprite = new BattleSpriteModel();
				battleSprite.position.set(tile);
				battleSprite.spriteId.set(id);
				this.model.battleMap.get().sprites.add(battleSprite);
			}
		}
	}

}
