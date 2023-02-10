import ModelNode from "./ModelNode";

export default class ModelNodeWithResources extends ModelNode {

	/**
	 * @type ResourcesModel
	 */
	resources;

	constructor(resources, persistent = true) {
		super(persistent);

		this.resources = resources;
	}

}
