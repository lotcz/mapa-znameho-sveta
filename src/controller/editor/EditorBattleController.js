import ControllerNode from "../basic/ControllerNode";
import BattleSpriteModel from "../../model/game/battle/battlemap/BattleSpriteModel";
import {
	MODE_ACTION_ADD,
	MODE_ACTION_DELETE,
	MODE_ACTION_SELECT,
	MODE_TYPE_3D,
	MODE_TYPE_NPC,
	MODE_TYPE_SPECIAL,
	MODE_TYPE_SPRITE
} from "../../model/editor/BattleEditorModel";
import BattleSpecialModel from "../../model/game/battle/battlemap/BattleSpecialModel";
import {Vector2} from "three";
import BattleSprite3dModel from "../../model/game/battle/battlemap/BattleSprite3dModel";
import BattleNpcSpawnModel from "../../model/game/battle/battlemap/BattleNpcSpawnModel";

export default class EditorBattleController extends ControllerNode {

	/**
	 * @type BattleModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

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

		const corner = this.model.coordinates.subtract(this.game.mainLayerSize.multiply(0.5 / this.model.zoom.get()));
		const coords = corner.add(this.game.mainLayerMouseCoordinates.multiply(1/this.model.zoom.get()));
		const position = this.model.battleMap.get().screenCoordsToPosition(coords);
		const tile = position.round();

		const battleEditorModel = this.game.editor.battleEditor;
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
				this.processClickSprites3d(tile, editorModeAction);
				break;
			case MODE_TYPE_NPC:
				this.processClickNpcSpawn(tile, editorModeAction);
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
			const id = this.game.editor.battleEditor.spriteId.get();
			if (id && (action === MODE_ACTION_ADD)) {
				const battleSprite = new BattleSpriteModel();
				battleSprite.position.set(tile);
				battleSprite.spriteId.set(id);
				this.model.battleMap.get().sprites.add(battleSprite);
			}
		}
	}

	processClickSprites3d(tile, action) {
		const sprite = this.model.battleMap.get().sprites3d.find((ch) => ch.position.round().equalsTo(tile));

		switch (action) {
			case MODE_ACTION_ADD:
				if (sprite) {
					break;
				}
				const id = this.game.editor.battleEditor.sprite3dId.get();
				if (id) {
					const battleSprite = new BattleSprite3dModel();
					battleSprite.position.set(tile);
					battleSprite.sprite3dId.set(id);
					this.model.battleMap.get().sprites3d.add(battleSprite);
				}
				break;
			case MODE_ACTION_DELETE:
				console.log('deleting 3D sprite', sprite);
				this.model.battleMap.get().sprites3d.remove(sprite);
				break;
			case MODE_ACTION_SELECT:
				if (sprite) {
					this.game.editor.activeForm.set(sprite);
				}
				break;
		}
	}

	processClickSpecial(tile, action) {
		const battleEditorModel = this.game.editor.battleEditor;
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
						const existing = this.model.battleMap.get().specials.find((s) => s.position.equalsTo(pos));
						if (!existing) {
							const special = new BattleSpecialModel();
							special.position.set(pos);
							special.type.set(editorSpecialType);
							this.model.battleMap.get().specials.add(special);
							this.game.editor.activeForm.set(special);
						}
					}
				}
				break;
			case MODE_ACTION_DELETE:
				for (let x = startX; x <= endX; x++) {
					for (let y = startY; y <= endY; y++) {
						const pos = new Vector2(x, y);
						const existing = this.model.battleMap.get().specials.find((s) => s.position.equalsTo(pos));
						if (existing) {
							this.model.battleMap.get().specials.remove(existing);
						}
					}
				}
				break;
			case MODE_ACTION_SELECT:
				const existing = this.model.battleMap.get().specials.filter((s) => s.position.equalsTo(tile));
				if (existing.length > 0) {
					const special = existing[0];
					this.game.editor.activeForm.set(special);
				}
				break;
		}
	}

	processClickNpcSpawn(tile, action) {
		const spawn = this.model.battleMap.get().npcSpawns.find((s) => s.position.round().equalsTo(tile));

		switch (action) {
			case MODE_ACTION_ADD:
				if (spawn) {
					break;
				}
				const id = this.game.editor.battleEditor.characterTemplateId.get();
				if (id) {
					const npcSpawn = new BattleNpcSpawnModel();
					npcSpawn.position.set(tile);
					npcSpawn.characterTemplateId.set(id);
					this.model.battleMap.get().npcSpawns.add(npcSpawn);
				}
				break;
			case MODE_ACTION_DELETE:
				console.log('deleting NPC spawn', spawn);
				this.model.battleMap.get().npcSpawns.remove(spawn);
				break;
			case MODE_ACTION_SELECT:
				if (spawn) {
					this.game.editor.activeForm.set(spawn);
				}
				break;
		}
	}

}
