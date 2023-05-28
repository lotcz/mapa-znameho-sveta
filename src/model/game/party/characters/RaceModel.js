import DirtyValue from "../../../basic/DirtyValue";
import IdentifiedModelNode from "../../../basic/IdentifiedModelNode";
import IntValue from "../../../basic/IntValue";
import Vector3 from "../../../basic/Vector3";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";
import StatEffectDefinitionModel from "../rituals/StatEffectDefinitionModel";
import EffectSourceModel, {EFFECT_SOURCE_RACE} from "../rituals/EffectSourceModel";
import FloatValue from "../../../basic/FloatValue";

export default class RaceModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 */
	description;

	/**
	 * @type IntValue
	 */
	skinMaterialId;

	/**
	 * @type IntValue
	 */
	male3dModelId;

	/**
	 * @type IntValue
	 */
	female3dModelId;

	/**
	 * @type Vector3
	 */
	scale;

	/**
	 * @type FloatValue
	 */
	runningSpeed;

	/**
	 * @type EffectSourceModel
	 */
	effectSource;

	/**
	 * @type ModelNodeCollection<StatEffectDefinitionModel>
	 */
	statEffects;

	/**
	 * @type ModelNodeCollection<StatEffectDefinitionModel>
	 */
	permanentEffects;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue('Adelan'));
		this.description = this.addProperty('description', new DirtyValue('Popis národa'));
		this.skinMaterialId = this.addProperty('skinMaterialId', new IntValue());

		this.male3dModelId = this.addProperty('male3dModelId', new IntValue(1));
		this.female3dModelId = this.addProperty('female3dModelId', new IntValue(2));

		this.scale = this.addProperty('scale', new Vector3(1,1,1));

		this.runningSpeed = this.addProperty('runningSpeed', new FloatValue(3.25));

		this.effectSource = new EffectSourceModel(EFFECT_SOURCE_RACE);
		this.effectSource.name.set(this.name.get());
		this.name.addOnChangeListener(() => this.effectSource.name.set(this.name.get()));

		this.statEffects = this.addProperty('statEffects', new ModelNodeCollection(() => new StatEffectDefinitionModel(this.effectSource)));
		this.permanentEffects = this.addProperty('permanentEffects', new ModelNodeCollection(() => new StatEffectDefinitionModel(this.effectSource)));

	}

}
