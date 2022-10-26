import DirtyValue from "../../../basic/DirtyValue";
import StatEffectDefinitionModel from "./StatEffectDefinitionModel";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";
import ModelNode from "../../../basic/ModelNode";

export default class PermanentBase extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type ModelNodeCollection<StatEffectDefinitionModel>
	 */
	statEffects;

	constructor() {
		super();

		this.name = this.addProperty('name', new DirtyValue(''));
		this.statEffects = this.addProperty('statEffects', new ModelNodeCollection(() => new StatEffectDefinitionModel()));
	}

}
