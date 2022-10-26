import ControllerNode from "../../../basic/ControllerNode";
import Collection from "../../../../class/basic/Collection";

export default class SkillController extends ControllerNode {

	/**
	 * @type StatModel
	 */
	model;

	/**
	 * @type CharacterStatsModel
	 */
	stats;

	constructor(game, model, stats) {
		super(game, model);

		this.model = model;
		this.stats = stats;

		this.cache = new Collection();

		this.sources = [this.stats.inventoryStatEffects, this.stats.environmentStatEffects, this.stats.raceStatEffects];
		this.addEffectHandler = (eff) => {
			if (eff.statId.equalsTo(this.model.definitionId.get())) {
				this.cache.add(eff);
			}
		};
		this.removeEffectHandler = (eff) => {
			if (eff.statId.equalsTo(this.model.definitionId.get())) {
				this.cache.remove(eff)
			}
		};

		this.addAutoEvent(
			this.cache,
			'change',
			() => this.updateCurrent()
		);

		this.addAutoEvent(
			this.model.baseValue,
			'change',
			() => this.updateCurrent(),
			true
		);
	}

	activateInternal() {
		this.sources.forEach((effects) => {
			effects.forEach(this.addEffectHandler);
			effects.addOnAddListener(this.addEffectHandler);
			effects.addOnRemoveListener(this.removeEffectHandler);
		});
	}

	deactivateInternal() {
		this.sources.forEach((effects) => {
			effects.removeOnAddListener(this.addEffectHandler);
			effects.removeOnRemoveListener(this.removeEffectHandler);
		});
	}

	updateCurrent() {
		const total = this.cache.reduce((prev, current) => prev + current.amount.get(), 0);
		this.model.currentFloat.set(this.model.baseValue.get() + total);
	}

}
