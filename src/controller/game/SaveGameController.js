import ControllerNode from "../basic/ControllerNode";
import SequenceController from "./sequence/SequenceController";
import MainScreenController from "./MainScreenController";
import NullableNodeController from "../basic/NullableNodeController";

export default class SaveGameController extends ControllerNode {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.animationSequence,
				(m) => new SequenceController(this.game, m, this.model),
				() => new MainScreenController(this.game, this.model)
			)
		);

		this.addAutoEvent(
			this.model,
			'quest-completed',
			(id) => {

			}
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
