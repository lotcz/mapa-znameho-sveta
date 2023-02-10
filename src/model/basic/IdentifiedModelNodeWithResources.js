import IdentifiedModelNode from "./IdentifiedModelNode";

export default class IdentifiedModelNodeWithResources extends IdentifiedModelNode {

	/**
	 * @type ResourcesModel
	 */
	resources;

	constructor(resources, id) {
		super(id);

		this.resources = resources;
	}

}
