import StatSkillRenderer from "../stats/StatSkillRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";
import Pixies from "../../../../class/basic/Pixies";
import ImageRenderer from "../../../basic/ImageRenderer";
import NullableNodeRenderer from "../../../basic/NullableNodeRenderer";
import RaceNameRenderer from "../stats/RaceNameRenderer";
import StatNumberRenderer from "../stats/StatNumberRenderer";
import StatBarRenderer from "../stats/StatBarRenderer";
import StatNameRenderer from "../stats/StatNameRenderer";
import ConditionalNodeRenderer from "../../../basic/ConditionalNodeRenderer";
import ButtonRenderer from "./ButtonRenderer";
import DomRendererWithSaveGame from "../../../basic/DomRendererWithSaveGame";

export default class InventoryTabStatsRenderer extends DomRendererWithSaveGame {

	/**
	 * @type CharacterModel
	 */
	model;

	constructor(game, model, party, dom) {
		super(game, model, dom);

		this.model = model;
		this.party = party;

	}

	activateInternal() {
		this.container = this.addElement( 'div', 'inventory-stats scroll container p-1 m-1');

		this.top = Pixies.createElement(this.container, 'div', 'row');

		this.portrait = Pixies.createElement(this.top, 'div', 'portrait');
		this.addChild(new ImageRenderer(this.game, this.model.portrait, this.portrait));

		this.info = Pixies.createElement(this.top, 'div', 'info mx-2 flex-1 column');
		this.inner = Pixies.createElement(this.info, 'div', 'col flex-1 space-between');
		this.race = Pixies.createElement(this.inner, 'div');
		this.race.addEventListener('mouseover', () => {
			this.saveGame.triggerEvent('race-hover', this.model.race.get());
		});
		this.race.addEventListener('mouseout', () => {
			this.saveGame.triggerEvent('race-hover', null);
		});
		this.raceName = Pixies.createElement(this.race, 'h3', 'name center', 'Plemeno');
		this.raceValue = Pixies.createElement(this.race, 'div', 'center');

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.race,
				(m) => new RaceNameRenderer(this.game, m, this.raceValue)
			)
		);

		this.level = Pixies.createElement(this.inner, 'div', 'col stat-level');
		this.level.addEventListener('mouseover', () => {
			this.saveGame.triggerEvent('stat-hover', this.model.stats.level.levelProgress);
		});
		this.level.addEventListener('mouseout', () => {
			this.saveGame.triggerEvent('stat-hover', null);
		});
		Pixies.createElement(this.level, 'h3', 'name center', 'Úroveň');
		this.levelNumeric = Pixies.createElement(this.level, 'div');
		this.addChild(new StatNumberRenderer(this.game, this.model.stats.level.currentLevel, this.levelNumeric));


		this.experienceWrapper = Pixies.createElement(this.inner, 'div');
		this.experienceWrapper.addEventListener('mouseover', () => {
			this.saveGame.triggerEvent('stat-hover', this.model.stats.level.experience);
		});
		this.experienceWrapper.addEventListener('mouseout', () => {
			this.saveGame.triggerEvent('stat-hover', null);
		});
		Pixies.createElement(this.experienceWrapper, 'h3', 'name center', 'Zkušenosti');
		this.experience = Pixies.createElement(this.experienceWrapper, 'div', 'row mt-1 mx-1 level-progress');
		const currentExp = Pixies.createElement(this.experience, 'div', 'mx-2');
		this.addChild(new StatNumberRenderer(this.game, this.model.stats.level.experience.current, currentExp));
		this.levelProgress = Pixies.createElement(this.experience, 'div', 'col center-vertical flex-1');
		this.addChild(new StatBarRenderer(this.game, this.model.stats.level.levelProgress, this.levelProgress));
		const nextExp = Pixies.createElement(this.experience, 'div', 'mx-2');
		this.addChild(new StatNumberRenderer(this.game, this.model.stats.level.experienceNextLevel, nextExp));

		Pixies.createElement(this.container, 'h2', 'center my-3', 'Vlastnosti');

		const abilityPoints= Pixies.createElement(this.container, 'div', 'row center mb-3');
		abilityPoints.addEventListener('mouseover', () => {
			this.saveGame.triggerEvent('stat-hover', this.model.stats.level.abilityPoints);
		});
		abilityPoints.addEventListener('mouseout', () => {
			this.saveGame.triggerEvent('stat-hover', null);
		});
		const apLabel = Pixies.createElement(abilityPoints, 'div');
		const apValue = Pixies.createElement(abilityPoints, 'div', 'stat-badge ml-3');
		const apConfirm = Pixies.createElement(abilityPoints, 'div', 'ml-3');
		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.model.stats.level.abilityPoints.current,
				() => this.model.stats.level.abilityPoints.current.get() < this.model.stats.level.abilityPoints.baseValue.get(),
				() => new ButtonRenderer(this.game, this.model.stats.level.abilityPoints.current, apConfirm, 'Potvrdit', () => this.model.stats.triggerEvent('apply-ability-points'))
			)
		);

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.stats.level.abilityPoints.definition,
				(m) => new StatNameRenderer(this.game, m, apLabel)
			)
		);
		this.addChild(new StatNumberRenderer(this.game, this.model.stats.level.abilityPoints.current, apValue));

		this.abilities = Pixies.createElement(this.container, 'div');
		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.abilities.all,
				(m) => new StatSkillRenderer(this.game, m, this.abilities, true, false)
			)
		);

		Pixies.createElement(this.container, 'h2', 'center my-3', 'Dovednosti');

		const skillPoints= Pixies.createElement(this.container, 'div', 'row center mb-3');
		skillPoints.addEventListener('mouseover', () => {
			this.saveGame.triggerEvent('stat-hover', this.model.stats.level.skillPoints);
		});
		skillPoints.addEventListener('mouseout', () => {
			this.saveGame.triggerEvent('stat-hover', null);
		});
		const spLabel = Pixies.createElement(skillPoints, 'div');
		const spValue = Pixies.createElement(skillPoints, 'div', 'stat-badge ml-3');
		const spConfirm = Pixies.createElement(skillPoints, 'div', 'ml-3');
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.stats.level.skillPoints.definition,
				(m) => new StatNameRenderer(this.game, m, spLabel)
			)
		);
		this.addChild(new StatNumberRenderer(this.game, this.model.stats.level.skillPoints.current, spValue));
		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.model.stats.level.skillPoints.current,
				() => this.model.stats.level.skillPoints.current.get() < this.model.stats.level.skillPoints.baseValue.get(),
				() => new ButtonRenderer(this.game, this.model.stats.level.abilityPoints.current, spConfirm, 'Potvrdit', () => this.model.stats.triggerEvent('apply-skill-points'))
			)
		);

		this.skills = Pixies.createElement(this.container, 'div');
		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.skills.all,
				(m) => new StatSkillRenderer(this.game, m, this.skills, false, true)
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
		this.container = null;
	}

}
