import DomRenderer from "../../../basic/DomRenderer";
import DirtyValueRenderer from "../../../basic/DirtyValueRenderer";

export default class StatNameRenderer extends DomRenderer {

	/**
	 * @type StatDefinitionModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(new DirtyValueRenderer(this.game, this.model.name, this.dom));
	}

}
