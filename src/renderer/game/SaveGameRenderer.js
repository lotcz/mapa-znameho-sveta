import DomRenderer from "../basic/DomRenderer";
import SequenceRenderer from "./sequence/SequenceRenderer";
import MainScreenRenderer from "./MainScreenRenderer";

export default class SaveGameRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addAutoEvent(
			this.model.animationSequence,
			'change',
			() => {
				this.resetChildren();
				if (this.model.animationSequence.isSet()) {
					this.addChild(new SequenceRenderer(this.game, this.model.animationSequence.get(), this.dom));
				} else {
					this.addChild(new MainScreenRenderer(this.game, this.model, this.dom));
				}
			},
			true
		);

	}

}
