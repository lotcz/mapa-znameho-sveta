import DirtyValue from "../../../basic/DirtyValue";
import TemplateNode from "../../../basic/TemplateNode";
import IntValue from "../../../basic/IntValue";
import BoolValue from "../../../basic/BoolValue";
import Vector3 from "../../../basic/Vector3";
import CharacterStatsModel from "../stats/CharacterStatsModel";
import InventoryModel from "./InventoryModel";
import NullableNode from "../../../basic/NullableNode";

export default class CharacterModel extends TemplateNode {

	/** @type DirtyValue */
	name;

	/**
	 * @type IntValue
	 */
	raceId;

	/**
	 * @type NullableNode<RaceModel>
	 */
	race;

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
	 * @type IntValue
	 */
	eyesItemDefinitionId;

	/**
	 * @type IntValue
	 */
	eyesMaterialId;

	/**
	 * @type IntValue
	 */
	beardItemDefinitionId;

	/**
	 * @type IntValue
	 */
	beardMaterialId;

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
	 * @type IntValue
	 */
	conversationId;

	constructor(id = 0) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue('Jinka'));
		this.raceId = this.addProperty('raceId', new IntValue());
		this.race = this.addProperty('race', new NullableNode(null, false));
		this.sex = this.addProperty('sex', new BoolValue(true));
		this.portrait = this.addProperty('portrait', new DirtyValue('img/portrait/kalinga/female-1.jpg'));

		this.hairMaterialId = this.addProperty('hairMaterialId', new IntValue());
		this.hairItemDefinitionId = this.addProperty('hairItemDefinitionId', new IntValue());

		this.eyesMaterialId = this.addProperty('eyesMaterialId', new IntValue());
		this.eyesItemDefinitionId = this.addProperty('eyesItemDefinitionId', new IntValue());

		this.beardMaterialId = this.addProperty('beardMaterialId', new IntValue());
		this.beardItemDefinitionId = this.addProperty('beardItemDefinitionId', new IntValue());

		this.scale = this.addProperty('scale', new Vector3(1,1,1));

		this.conversationId = this.addProperty('conversationId', new IntValue());

		this.stats = this.addProperty('stats', new CharacterStatsModel());

		this.inventory = this.addProperty('inventory', new InventoryModel());

	}

	clone() {
		const ch = new CharacterModel();
		ch.restoreState(this.getState());
		ch.originalId.set(this.id.get());
		return ch;
	}

}
