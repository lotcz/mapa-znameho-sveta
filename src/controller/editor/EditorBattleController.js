import ControllerNode from "../basic/ControllerNode";
import NullableNodeController from "../basic/NullableNodeController";
import EditorBattleMapController from "./EditorBattleMapController";
import BattleSpriteModel from "../../model/game/battle/BattleSpriteModel";
import {
	MODE_ACTION_ADD,
	MODE_ACTION_DELETE,
	MODE_ACTION_SELECT,
	MODE_TYPE_3D,
	MODE_TYPE_SPECIAL,
	MODE_TYPE_SPRITE
} from "../../model/editor/BattleEditorModel";
import BattleSpecialModel from "../../model/game/battle/BattleSpecialModel";
import {Vector2} from "three";

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

		const battleEditorModel = this.game.editor.battleEditor.get();
		const editorModeType = battleEditorModel.modeType.get();
		const editorModeAction = battleEditorModel.modeAction.get();

		switch (editorModeType) {
			case MODE_TYPE_SPRITE:
				this.processClickSprites(tile, editorModeAction);
				break;
			case MODE_TYPE_SPECIAL:
				this.processClickSpecial(tile, editorModeAction);
				break;
			case MODE_TYPE_3D:
				//this.processClickSprites(tile, editorModeAction);
				break;
		}

	}

	processClickSprites(tile, action) {
		const sprite = this.model.battleMap.get().sprites.find((ch) => ch.position.round().equalsTo(tile));
		if (sprite) {
			if (action === MODE_ACTION_DELETE) {
				console.log('deleting sprite', sprite);
				this.model.battleMap.get().sprites.remove(sprite);
			}
		} else {
			const id = this.game.editor.battleEditor.get().spriteId.get();
			if (id && (action === MODE_ACTION_ADD)) {
				const battleSprite = new BattleSpriteModel();
				battleSprite.position.set(tile);
				battleSprite.spriteId.set(id);
				this.model.battleMap.get().sprites.add(battleSprite);
			}
		}
	}

	processClickSpecial(tile, action) {
		const battleEditorModel = this.game.editor.battleEditor.get();
		const startX = tile.x - battleEditorModel.brushSize.get();
		const endX = tile.x + battleEditorModel.brushSize.get();
		const startY = tile.y - battleEditorModel.brushSize.get();
		const endY = tile.y + battleEditorModel.brushSize.get();

		switch (action) {
			case MODE_ACTION_ADD:
				const editorSpecialType = battleEditorModel.specialType.get();
				for (let x = startX; x <= endX; x++) {
					for (let y = startY; y <= endY; y++) {
						const pos = new Vector2(x, y);
						const existing = this.model.battleMap.get().specials.find((s) => s.position.round().equalsTo(pos));
						if (!existing) {
							const special = new BattleSpecialModel();
							special.position.set(pos);
							special.type.set(editorSpecialType);
							this.model.battleMap.get().specials.add(special);
						}
					}
				}
				break;
			case MODE_ACTION_DELETE:
				for (let x = startX; x <= endX; x++) {
					for (let y = startY; y <= endY; y++) {
						const pos = new Vector2(x, y);
						const existing = this.model.battleMap.get().specials.find((s) => s.position.round().equalsTo(pos));
						if (existing) {
							this.model.battleMap.get().specials.remove(existing);
						}
					}
				}
				break;
			case MODE_ACTION_SELECT:

				break;
		}
	}

}
