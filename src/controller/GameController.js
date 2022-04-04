import ControllerNode from "../node/ControllerNode";
import ControlsController from "./ControlsController";
import MapController from "./MapController";

export default class GameController extends ControllerNode {

	/**
	 * @type GameModel
	 */
	model;

	controlsController;

	constructor(model) {
		super(model, model);

		this.model = model;

		this.controlsController = this.addChild(new ControlsController(this.game, this.model.controls));
		this.mapController = this.addChild(new MapController(this.game, this.model.map));

		this.onResizeHandler = () => this.onResize();
	}

	activateInternal() {
		this.onResize();
		window.addEventListener('resize', this.onResizeHandler);
	}

	deactivateInternal() {
		window.removeEventListener('resize', this.onResizeHandler);
	}


	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
	}

}
