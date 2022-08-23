import ControllerNode from "./ControllerNode";

export default class NullableNodeController extends ControllerNode {

	/**
	 * @type NullableNode
	 */
	model;

	constructor(game, model, controllerFactory) {
		super(game, model);
		this.model = model;

		this.controllerFactory = controllerFactory;
		this.onModelChangedHandler = () => this.updateController();
	}

	activateInternal() {
		this.updateController();

		this.model.addOnChangeListener(this.onModelChangedHandler);
	}

	deactivateInternal() {
		this.model.removeOnChangeListener(this.onModelChangedHandler);
		this.resetChildren();
	}

	updateController() {
		this.resetChildren();
		if (this.model.isSet()) {
			this.addChild(this.controllerFactory(this.model.get()));
		}
	}

}
