import ControllerNode from "./ControllerNode";

export default class AnimationController extends ControllerNode {

	/**
	 * @type () => any|null
	 */
	on_finished;

	/**
	 *
	 * @param game GameModel
	 * @param model DirtyValue
	 * @param onFinished () => any|null
	 */
	constructor(game, model, onFinished = null) {
		super(game, model);

		this.on_finished = onFinished;
	}

	/**
	 *
	 * @param func () => any
	 * @returns {AnimationController}
	 */
	onFinished(func) {
		this.on_finished = func;
		return this;
	}

	finished() {
		this.removeMyself();
		this.model.triggerEvent('animation-finished');
		if (this.on_finished) this.on_finished();
	}

}
