import DomRenderer from "../../../basic/DomRenderer";
import StatSkillRenderer from "../stats/StatSkillRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";
import Pixies from "../../../../class/basic/Pixies";
import ImageRenderer from "../../../basic/ImageRenderer";
import NullableNodeRenderer from "../../../basic/NullableNodeRenderer";
import RaceNameRenderer from "../stats/RaceNameRenderer";
import StatNumberRenderer from "../stats/StatNumberRenderer";
import StatBarRenderer from "../stats/StatBarRenderer";

export default class InventoryTabStatsRenderer extends DomRenderer {

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

		this.race = Pixies.createElement(this.info, 'div', 'row stat-skill');
		this.raceName = Pixies.createElement(this.race, 'div', 'name', 'Plemeno');
		this.raceValue = Pixies.createElement(this.race, 'div');

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.race,
				(m) => new RaceNameRenderer(this.game, m, this.raceValue)
			)
		);

		this.level = Pixies.createElement(this.info, 'div', 'row stat-skill stat-level');
		Pixies.createElement(this.level, 'div', 'name', 'Úroveň');
		this.levelNumeric = Pixies.createElement(this.level, 'div');
		this.addChild(new StatNumberRenderer(this.game, this.model.stats.level.currentLevel, this.levelNumeric));
		this.experience = Pixies.createElement(this.level, 'div', 'flex-1');
		this.addChild(new StatBarRenderer(this.game, this.model.stats.level.levelProgress, this.experience));

		this.temperature = Pixies.createElement(this.info, 'div', 'row stat-skill');
		Pixies.createElement(this.temperature, 'div', 'name', 'Teplota');
		this.temperatureInner = Pixies.createElement(this.temperature, 'div', 'row');
		this.addChild(new StatNumberRenderer(this.game, this.model.stats.consumption.temperature.baseValue, this.temperatureInner));
		this.addChild(new StatBarRenderer(this.game, this.model.stats.consumption.temperature, this.temperatureInner));
		this.addChild(new StatNumberRenderer(this.game, this.model.stats.consumption.temperature.currentFloat, this.temperatureInner));


		Pixies.createElement(this.container, 'h2', 'center my-3', 'Vlastnosti');
		this.abilities = Pixies.createElement(this.container, 'div');
		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.abilities.all,
				(m) => new StatSkillRenderer(this.game, m, this.abilities)
			)
		);

		Pixies.createElement(this.container, 'h2', 'center my-3', 'Dovednosti');
		this.skills = Pixies.createElement(this.container, 'div');
		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.skills.all,
				(m) => new StatSkillRenderer(this.game, m, this.skills)
			)
		);
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
		this.container = null;
	}

}
