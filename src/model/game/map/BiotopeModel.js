import ModelNodeCollection from "../../basic/ModelNodeCollection";
import BiotopeImageModel from "./BiotopeImageModel";
import DirtyValue from "../../basic/DirtyValue";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import StatEffectDefinitionModel from "../party/rituals/StatEffectDefinitionModel";

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

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue('Biotope 1'));
		this.images = this.addProperty('images', new ModelNodeCollection(() => new BiotopeImageModel()));
		this.images.addOnAddListener(() => this.sortImages());
		this.images.addOnRemoveListener(() => this.sortImages());

		this.statEffects = this.addProperty('statEffects', new ModelNodeCollection(() => new StatEffectDefinitionModel()));

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
