import DomRenderer from "../../../basic/DomRenderer";
import TooltipRenderer from "../../../basic/TooltipRenderer";

export default class StatNameRenderer extends DomRenderer {

	/**
	 * @type StatDefinitionModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(new TooltipRenderer(this.game, this.model.name, this.model.description, this.dom));
	}

}
