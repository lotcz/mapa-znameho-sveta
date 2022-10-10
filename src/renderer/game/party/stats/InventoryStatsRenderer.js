import DomRenderer from "../../../basic/DomRenderer";
import InventorySkillRenderer from "./InventorySkillRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class InventoryStatsRenderer extends DomRenderer {

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
		Pixies.createElement(this.container, 'h2', null, 'Vlastnosti');
		this.abilities = Pixies.createElement(this.container, 'div');
		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.abilities,
				(m) => new InventorySkillRenderer(this.game, m, this.abilities)
			)
		);

		Pixies.createElement(this.container, 'h2', null, 'Dovednosti');
		this.skills = Pixies.createElement(this.container, 'div');
		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.skills,
				(m) => new InventorySkillRenderer(this.game, m, this.skills)
			)
		);

		this.party.triggerEvent('inventory-resize');
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.container = null;
		this.party.triggerEvent('inventory-resize');
	}

}
