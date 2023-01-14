import ControllerNode from "../basic/ControllerNode";
import SequenceController from "./sequence/SequenceController";
import MainScreenController from "./MainScreenController";

export default class SaveGameController extends ControllerNode {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.model.animationSequence,
			'change',
			() => {
				this.resetChildren();
				if (this.model.animationSequence.isSet()) {
					this.addChild(new SequenceController(this.game, this.model.animationSequence.get(), this.model));
				} else {
					this.addChild(new MainScreenController(this.game, this.model));
				}
			},
			true
		);

		this.addAutoEvent(
			this.model,
			'start-sequence',
			(sequenceId) => {
				this.runOnUpdate(() => this.startSequence(sequenceId));
			}
		);

		this.addAutoEvent(
			this.model,
			'sequence-finished',
			() => {
				this.runOnUpdate(() => this.sequenceFinished());
			}
		);
	}

	startSequence(sequenceId) {
		const sequence = this.game.resources.sequences.getById(sequenceId);
		this.model.animationSequence.set(null);
		this.model.animationSequence.set(sequence);
	}

	sequenceFinished() {
		this.model.animationSequence.set(null);
		console.log('sequence finished');
	}
}
