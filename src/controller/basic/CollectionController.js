import ControllerNode from "./ControllerNode";

export default class CollectionController extends ControllerNode {

	/**
	 * @type ModelNodeCollection
	 */
	model;

	constructor(game, model, controllerFactory) {
		super(game, model);
		this.model = model;

		this.controllerFactory = controllerFactory;

		this.addAutoEvent(
			this.model.children,
			'add',
			(model) => this.createController(model)
		);

		this.addAutoEvent(
			this.model.children,
			'remove',
			(model) => this.removeController(model)
		);
	}

	activateInternal() {
		this.resetChildren();
		this.model.children.forEach((model) => this.createController(model));
	}

	deactivateInternal() {
		this.resetChildren();
	}

	createController(model) {
		return this.addChild(this.controllerFactory(model));
	}

	removeController(model) {
		const controller = this.children.find((ch) => ch.model === model);
		this.removeChild(controller);
	}

}
