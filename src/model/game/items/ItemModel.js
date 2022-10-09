import IntValue from "../../basic/IntValue";
import ModelNode from "../../basic/ModelNode";
import StatModel from "../party/stats/StatModel";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import StatEffectDefinitionModel from "../party/rituals/StatEffectDefinitionModel";

export default class ItemModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	definitionId;

	/**
	 * @type IntValue
	 * Used for rendering hair
	 */
	primaryMaterialId;

	/**
	 * @type StatModel
	 */
	condition;

	/**
	 * @type ModelNodeCollection<StatEffectDefinitionModel>
	 */
	statEffects;

	constructor() {
		super();

		this.definitionId = this.addProperty('definitionId', new IntValue());
		this.primaryMaterialId = this.addProperty('primaryMaterialId', new IntValue());

		this.condition = this.addProperty('condition', new StatModel());

		this.statEffects = this.addProperty('statEffects', new ModelNodeCollection(() => new StatEffectDefinitionModel()));

	}

}
