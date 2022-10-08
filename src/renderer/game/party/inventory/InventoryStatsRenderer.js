import DomRenderer from "../../../basic/DomRenderer";
import InventorySkillRenderer from "./InventorySkillRenderer";
import InventoryStatFloatRenderer from "./InventoryStatFloatRenderer";

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
		this.container = this.addElement( 'div', 'column');

		this.addChild(new InventoryStatFloatRenderer(this.game, this.model.stats.health, this.container));
		this.addChild(new InventoryStatFloatRenderer(this.game, this.model.stats.mental, this.container));
		this.addChild(new InventoryStatFloatRenderer(this.game, this.model.stats.physical, this.container));

		this.addChild(new InventorySkillRenderer(this.game, this.model.stats.strength, this.container));
		this.addChild(new InventorySkillRenderer(this.game, this.model.stats.meleeWeapons, this.container));


		this.party.triggerEvent('inventory-resize');
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
		this.container = null;
		this.party.triggerEvent('inventory-resize');
	}

}
