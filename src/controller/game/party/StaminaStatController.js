import ControllerNode from "../../basic/ControllerNode";

export default class StaminaStatController extends ControllerNode {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, character) {
		super(game, model);

		this.model = model;
		this.character = character;

		const deps = [this.character.stats.strength.current, this.character.stats.toughness.current, this.character.stats.agility.current];
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
		const strength = this.character.stats.strength.current.get();
		const toughness = this.character.stats.toughness.current.get();
		const agility = this.character.stats.agility.current.get();
		const stamina = (2 * strength) + (1 * toughness) + agility;

		const origRatio = this.model.currentFloat.get() / this.model.baseValue.get();
		this.model.baseValue.set(stamina);
		this.model.currentFloat.set(stamina * origRatio);
	}

}
