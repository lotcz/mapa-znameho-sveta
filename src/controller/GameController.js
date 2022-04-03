import ControllerNode from "../node/ControllerNode";
import ControlsController from "./ControlsController";

export default class GameController extends ControllerNode {

	/**
	 * @type GameModel
	 */
	model;

	controlsController;

	dragging;

	constructor(model) {
		super(model, model);

		this.model = model;
		this.controlsController = this.addChild(new ControlsController(this.game, this.model.controls));
		this.dragging = false;
		this.onResizeHandler = () => this.onResize();

		this.game.addEventListener('helperMouseOver', (point) => this.model.focusedHelper.set(point));
		this.game.addEventListener('helperMouseOut', (point) => {
			if (this.model.focusedHelper.equalsTo(point))
				this.model.focusedHelper.set(null);
		});

	}

	activateInternal() {
		this.onResize();
		window.addEventListener('resize', this.onResizeHandler);
		this.model.controls.mouseCoordinates.addOnChangeListener(() => this.onMouseMove());
	}

	deactivateInternal() {
		window.removeEventListener('resize', this.onResizeHandler);
	}

	updateInternal(delta) {
		super.updateInternal(delta);

		const path = this.game.map.path;
		let progress = path.pathProgress.get();

		if (path.forward.get()) {
			progress += 0.003;
		} else {
			progress -= 0.003;
		}

		if (progress > 1) {
			progress = 2-progress;
			path.forward.set(!path.forward.get());
		}

		if (progress < 0) {
			progress = -progress;
			path.forward.set(!path.forward.get());
		}

		path.pathProgress.set(progress);
	}

	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
	}

	onMouseMove() {
		if (this.dragging) {
			if (this.model.controls.mouseDownLeft.get()) {
				this.dragging.set(this.model.controls.mouseCoordinates);
			} else {
				this.dragging = false;
			}
		} else {
			if (this.model.controls.mouseDownLeft.get() && this.model.focusedHelper.isSet()) {
				this.dragging = this.model.focusedHelper.get();
			}
		}
	}

}
