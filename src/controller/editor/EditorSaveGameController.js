import ControllerNode from "../basic/ControllerNode";
import NullableNodeController from "../basic/NullableNodeController";
import EditorBattleController from "./EditorBattleController";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/game/SaveGameModel";

export default class EditorSaveGameController extends ControllerNode {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.currentBattle,
				(m) => new EditorBattleController(this.game, m)
			)
		);

		this.addAutoEvent(
			this.model,
			'save',
			() => this.game.triggerEvent('save-game')
		);

		this.addAutoEvent(
			this.model,
			'switch-mode-map',
			() => this.runOnUpdate(
				() => this.model.mode.set(GAME_MODE_MAP)
			)
		);

		this.addAutoEvent(
			this.model,
			'switch-mode-battle',
			() => this.runOnUpdate(
				() => this.model.mode.set(GAME_MODE_BATTLE)
			)
		);
	}

}
