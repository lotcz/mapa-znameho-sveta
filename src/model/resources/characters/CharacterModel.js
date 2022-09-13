import DirtyValue from "../../basic/DirtyValue";
import TemplateNode from "../../basic/TemplateNode";
import IntValue from "../../basic/IntValue";
import BoolValue from "../../basic/BoolValue";
import Vector3 from "../../basic/Vector3";
import CharacterStatsModel from "./CharacterStatsModel";
import InventoryModel from "./InventoryModel";
import InventorySlotModel from "./InventorySlotModel";

export default class CharacterModel extends TemplateNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type IntValue
	 */
	raceId;

	/**
	 * @type BoolValue
	 */
	sex;

	/**
	 * @type DirtyValue
	 */
	portrait;

	/**
	 * @type IntValue
	 */
	hairItemDefinitionId;

	/**
	 * @type IntValue
	 */
	hairMaterialId;

	/**
	 * @type Vector3
	 */
	scale;

	/**
	 * @type CharacterStatsModel
	 */
	stats;

	/**
	 * @type InventoryModel
	 */
	inventory;

	/**
	 * @type InventorySlotModel
	 */
	hairSlot;

	/**
	 * @type InventorySlotModel
	 */
	dropSlot;

	constructor(id = 0) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue('Jinka'));
		this.raceId = this.addProperty('raceId', new IntValue(0));
		this.sex = this.addProperty('sex', new BoolValue(true));
		this.portrait = this.addProperty('portrait', new DirtyValue('img/portrait/adelan/female-1.jpg'));

		this.hairMaterialId = this.addProperty('hairMaterialId', new IntValue(0));
		this.hairItemDefinitionId = this.addProperty('hairItemDefinitionId', new IntValue(0));
		this.scale = this.addProperty('scale', new Vector3(1,1,1));

		this.stats = this.addProperty('stats', new CharacterStatsModel());

		this.inventory = this.addProperty('inventory', new InventoryModel());

		this.hairSlot =  this.addProperty('hairSlot', new InventorySlotModel(['head'], 'head'));
		this.dropSlot =  this.addProperty('dropSlot', new InventorySlotModel(['all'], 'drop'));
	}

}
