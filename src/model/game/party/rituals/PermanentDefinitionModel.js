import DirtyValue from "../../../basic/DirtyValue";
import IdentifiedModelNode from "../../../basic/IdentifiedModelNode";
import StatEffectDefinitionModel from "./StatEffectDefinitionModel";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";

export default class PermanentDefinitionModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type ModelNodeCollection<StatEffectDefinitionModel>
	 */
	statEffects;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Permanent ${id}`));
		this.statEffects = this.addProperty('statEffects', new ModelNodeCollection(() => new StatEffectDefinitionModel()));
	}

}
