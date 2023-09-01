import ModelNodeCollection from "../../basic/ModelNodeCollection";
import BiotopeImageModel from "./BiotopeImageModel";
import DirtyValue from "../../basic/DirtyValue";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import StatEffectDefinitionModel from "../party/rituals/StatEffectDefinitionModel";
import EffectSourceModel, {EFFECT_SOURCE_WEATHER} from "../party/rituals/EffectSourceModel";
import StringValue from "../../basic/StringValue";

export default class BiotopeModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type ModelNodeCollection
	 */
	images;

	/**
	 * @type ModelNodeCollection<StatEffectDefinitionModel>
	 */
	statEffects;

	/**
	 * @type StringValue
	 */
	musicUrlNormal;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue('Biotope 1'));
		this.images = this.addProperty('images', new ModelNodeCollection(() => new BiotopeImageModel()));
		this.images.addOnAddListener(() => this.sortImages());
		this.images.addOnRemoveListener(() => this.sortImages());

		this.effectSource = new EffectSourceModel(EFFECT_SOURCE_WEATHER);
		this.effectSource.name.set(this.name.get());
		this.name.addOnChangeListener(() => this.effectSource.name.set(this.name.get()));

		this.statEffects = this.addProperty('statEffects', new ModelNodeCollection(() => new StatEffectDefinitionModel(this.effectSource)));

		this.musicUrlNormal = this.addProperty('musicUrlNormal', new StringValue());

	}

	sortImages() {
		this.images.sort((a, b) => {
			if (a.time.equalsTo(b.time.get())) {
				return 0;
			}
			return a.time.get() > b.time.get() ? 1 : -1;
		});
	}

}
