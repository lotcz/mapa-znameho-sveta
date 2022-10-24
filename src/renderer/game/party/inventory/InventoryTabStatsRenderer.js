import DomRenderer from "../../../basic/DomRenderer";
import StatSkillRenderer from "../stats/StatSkillRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class InventoryTabStatsRenderer extends DomRenderer {

	/**
	 * @type CharacterModel
	 */
	model;

	constructor(game, model, party, dom) {
		super(game, model, dom);

		this.model = model;
		this.party = party;

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.abilities.all,
				(m) => new StatSkillRenderer(this.game, m, this.abilities)
			)
		);

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.skills.all,
				(m) => new StatSkillRenderer(this.game, m, this.skills)
			)
		);
	}

	activateInternal() {
		this.container = this.addElement( 'div', 'inventory-stats column flex-1 p-1 m-1');
		Pixies.createElement(this.container, 'h2', null, 'Vlastnosti');
		this.abilities = Pixies.createElement(this.container, 'div');

		Pixies.createElement(this.container, 'h2', null, 'Dovednosti');
		this.skills = Pixies.createElement(this.container, 'div');

	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.container = null;
	}

}
