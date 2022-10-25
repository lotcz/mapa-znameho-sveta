import DomRenderer from "../../../basic/DomRenderer";
import StatSkillRenderer from "../stats/StatSkillRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";
import Pixies from "../../../../class/basic/Pixies";
import StatLevelRenderer from "../stats/StatLevelRenderer";

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
		this.container = this.addElement( 'div', 'inventory-stats column flex-1 p-1 m-1');
		Pixies.createElement(this.container, 'h2', null, 'Úroveň postavy');
		this.level = Pixies.createElement(this.container, 'div');
		this.addChild(new StatLevelRenderer(this.game, this.model.stats.levelProgress.level, this.level));

		Pixies.createElement(this.container, 'h2', null, 'Vlastnosti');
		this.abilities = Pixies.createElement(this.container, 'div');
		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.abilities.all,
				(m) => new StatSkillRenderer(this.game, m, this.abilities)
			)
		);

		Pixies.createElement(this.container, 'h2', null, 'Dovednosti');
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
