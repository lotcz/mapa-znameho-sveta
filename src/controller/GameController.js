import ControllerNode from "../node/ControllerNode";
import ControlsController from "./ControlsController";
import MapController from "./MapController";

const DEBUG_MODE_ENABLED = true;

export default class GameController extends ControllerNode {

	/**
	 * @type GameModel
	 */
	model;

	controlsController;
	mapController;

	constructor(model) {
		super(model, model);

		this.model = model;

		this.controlsController = this.addChild(new ControlsController(this.game, this.model.controls));
		this.mapController = this.addChild(new MapController(this.game, this.model.map));

		this.onResizeHandler = () => this.onResize();
		this.onDebugKeyHandler = () => this.onDebugKey();
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
		this.model.three.rotation.set(this.model.three.rotation.get()+1);
	}

	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
	}

	onDebugKey() {
		this.model.isInDebugMode.set(!this.model.isInDebugMode.get());
	}

}
