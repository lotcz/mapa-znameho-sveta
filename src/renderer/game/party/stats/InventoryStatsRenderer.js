import DomRenderer from "../../../basic/DomRenderer";
import InventorySkillRenderer from "./InventorySkillRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";

export default class InventoryStatsRenderer extends DomRenderer {

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
				this.model.stats.abilities,
				(m) => new InventorySkillRenderer(this.game, m, this.container)
			)
		);

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.skills,
				(m) => new InventorySkillRenderer(this.game, m, this.container)
			)
		);
	}

	activateInternal() {
		this.container = this.addElement( 'div', 'inventory-stats column');
		this.party.triggerEvent('inventory-resize');
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.container = null;
		this.party.triggerEvent('inventory-resize');
	}

}
