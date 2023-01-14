import ControllerNode from "./ControllerNode";

export default class NullableNodeController extends ControllerNode {

	/**
	 * @type NullableNode
	 */
	model;

	constructor(game, model, controllerFactory, defaultControllerFactory = null) {
		super(game, model);

		this.model = model;

		this.controllerFactory = controllerFactory;
		this.defaultControllerFactory = defaultControllerFactory;

		this.addAutoEvent(
			this.model,
			'change',
			() => this.updateController(),
			true
		);
	}

	updateController() {
		this.resetChildren();
		if (this.model.isSet()) {
			 this.addChild(this.controllerFactory(this.model.get()));
		} else if (this.defaultControllerFactory) {
			this.addChild(this.defaultControllerFactory());
		}
	}

}
