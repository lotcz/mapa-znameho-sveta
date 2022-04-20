import ControllerNode from "../node/ControllerNode";
import ControlsController from "./ControlsController";
import MapController from "./MapController";
import {GAME_MODE_BATTLE, GAME_MODE_MAP, GAME_MODE_THREE} from "../model/SaveGameModel";
import MapRenderer from "../renderer/MapRenderer";
import ThreeRenderer from "../renderer/ThreeRenderer";
import BattleController from "./BattleController";

const DEBUG_MODE_ENABLED = true;

export default class GameController extends ControllerNode {

	/**
	 * @type GameModel
	 */
	model;

	controlsController;

	mainController;

	constructor(model) {
		super(model, model);

		this.model = model;

		this.controlsController = this.addChild(new ControlsController(this.game, this.model.controls));

		this.onResizeHandler = () => this.onResize();
		this.onDebugKeyHandler = () => this.onDebugKey();

		this.model.saveGame.mode.addOnChangeListener(() => {
			this.updateGameMode();
		});

		this.updateGameMode();
	}

	activateInternal() {
		this.onResize();
		window.addEventListener('resize', this.onResizeHandler);
		this.model.controls.addOnDebugKeyListener(this.onDebugKeyHandler);
	}

	deactivateInternal() {
		window.removeEventListener('resize', this.onResizeHandler);
		this.model.controls.removeOnDebugKeyListener(this.onDebugKeyHandler);
	}

	updateInternal(delta) {
		//this.model.three.rotation.set(this.model.three.rotation.get()+1);
	}

	updateGameMode() {
		const mode = this.model.saveGame.mode.get();
		if (this.mainController) this.removeChild(this.mainController);

		switch (mode) {
			case GAME_MODE_MAP:
				this.mainController = this.addChild(new MapController(this.game, this.model.saveGame));
				break;
			case GAME_MODE_THREE:
				//this.mainController = this.addChild(new MapController(this.game, this.model.saveGame));
				break;
			case GAME_MODE_BATTLE:
				this.mainController = this.addChild(new BattleController(this.game, this.model.battle));
				break;
		}

	}

	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
		this.model.characterPreview.size.set(this.model.viewBoxSize);
	}

	onDebugKey() {
		this.model.isInDebugMode.set(!this.model.isInDebugMode.get());
	}

}
