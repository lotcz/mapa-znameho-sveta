import IdentifiedModelNode from "./IdentifiedModelNode";

export default class IdentifiedModelNodeWithResources extends IdentifiedModelNode {

	/**
	 * @type ResourcesModel
	 */
	resources;

	constructor(resources, id, persistent = true) {
		super(id, persistent);

		this.resources = resources;
	}

}
