import ControllerNode from "../../basic/ControllerNode";

export default class HealthStatController extends ControllerNode {

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
		const health = (1 * strength) + (2 * toughness) + agility;

		const origRatio = this.model.currentFloat.get() / this.model.baseValue.get();
		this.model.baseValue.set(health);
		this.model.currentFloat.set(health * origRatio);
	}

}
