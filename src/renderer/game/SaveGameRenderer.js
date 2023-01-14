import DomRenderer from "../basic/DomRenderer";
import SequenceRenderer from "./sequence/SequenceRenderer";
import MainScreenRenderer from "./MainScreenRenderer";
import NullableNodeRenderer from "../basic/NullableNodeRenderer";

export default class SaveGameRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.animationSequence,
				(m) => new SequenceRenderer(this.game, m, this.dom),
				() => new MainScreenRenderer(this.game, this.model, this.dom)
			)
		);

	}

}
