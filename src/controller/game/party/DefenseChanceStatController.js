import ControllerNode from "../../basic/ControllerNode";

export default class DefenseChanceStatController extends ControllerNode {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, character) {
		super(game, model);

		this.model = model;
		this.character = character;

		const deps = [this.character.stats.agility.current, this.character.stats.evasion.current];
		deps.forEach((dep) => {
			this.addAutoEvent(
				dep,
				'change',
				() => this.updateBase(),
				true
			);
		});
	}

	updateBase() {
		const evasion = this.character.stats.evasion.current.get();
		const agility = this.character.stats.agility.current.get();
		const chance = (1 * agility) + (2 * evasion);
		this.model.baseValue.set(chance);
	}

}
