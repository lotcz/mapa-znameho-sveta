import ModelNodeCollection from "../../basic/ModelNodeCollection";
import BiotopeImageModel from "./BiotopeImageModel";
import DirtyValue from "../../basic/DirtyValue";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";

export default class BiotopeModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type ModelNodeCollection
	 */
	images;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue('Biotope 1'));
		this.images = this.addProperty('images', new ModelNodeCollection(() => new BiotopeImageModel()));

	}

}
