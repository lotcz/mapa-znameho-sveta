import ControllerNode from "../node/ControllerNode";

export default class CollectionController extends ControllerNode {

	/**
	 * @type ModelNodeCollection
	 */
	model;

	constructor(game, model, controllerFactory) {
		super(game, model);
		this.model = model;

		this.controllerFactory = controllerFactory;
	}

	activateInternal() {
		this.resetChildren();

		this.model.children.forEach((model) => this.createController(model));

		this.model.children.addOnAddListener((model) => this.createController(model));
		this.model.children.addOnRemoveListener((model) => this.removeController(model));
	}

	deactivateInternal() {
		this.model.children.removeOnAddListener((model) => this.createController(model));
		this.model.children.removeOnRemoveListener((model) => this.removeController(model));
		this.resetChildren();
	}

	createController(model) {
		const controller = this.addChild(this.controllerFactory(model));
		return controller;
	}

	removeController(model) {
		const controller = this.children.find((ch) => ch.model === model);
		this.removeChild(controller);
	}

}
