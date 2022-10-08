import DirtyValue from "../../../basic/DirtyValue";
import IdentifiedModelNode from "../../../basic/IdentifiedModelNode";
import EffectDefinitionModel from "./EffectDefinitionModel";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";

export default class PermanentDefinitionModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type ModelNodeCollection<EffectDefinitionModel>
	 */
	skillEffects;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Permanent ${id}`));
		this.skillEffects = this.addProperty('skillEffects', new ModelNodeCollection(() => new EffectDefinitionModel()));
	}

}
