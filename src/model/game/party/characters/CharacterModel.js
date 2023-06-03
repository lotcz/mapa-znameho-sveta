import DirtyValue from "../../../basic/DirtyValue";
import TemplateNode from "../../../basic/TemplateNode";
import IntValue from "../../../basic/IntValue";
import BoolValue from "../../../basic/BoolValue";
import Vector3 from "../../../basic/Vector3";
import CharacterStatsModel from "../stats/CharacterStatsModel";
import InventoryModel from "./InventoryModel";
import ItemSlotModel from "../../items/ItemSlotModel";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";
import AdditionalItemModel from "../../items/AdditionalItemModel";
import ItemModel from "../../items/ItemModel";
import NullableNode from "../../../basic/NullableNode";

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
	 * @type ItemSlotModel
	 */
	hairSlot;

	/**
	 * @type ItemSlotModel
	 */
	dropSlot;

	/**
	 * @type ModelNodeCollection<AdditionalItemModel>
	 */
	additionalItems;

	/**
	 * @type ModelNodeCollection<ItemSlotModel>
	 */
	additionalItemsSlots;

	/**
	 * @type IntValue
	 */
	npcConversationId;

	/**
	 * @type IntValue
	 */
	partyConversationId;

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

		this.npcConversationId = this.addProperty('npcConversationId', new IntValue());
		this.partyConversationId = this.addProperty('partyConversationId', new IntValue());

		this.stats = this.addProperty('stats', new CharacterStatsModel());

		this.inventory = this.addProperty('inventory', new InventoryModel());

		this.hairSlot =  this.addProperty('hairSlot', new ItemSlotModel(['head'], 'hair', false));
		this.eyesSlot =  this.addProperty('eyesSlot', new ItemSlotModel(['head'], 'eyes', false));
		this.beardSlot =  this.addProperty('beardSlot', new ItemSlotModel(['head'], 'beard', false));
		this.dropSlot =  this.addProperty('dropSlot', new ItemSlotModel(['all'], 'drop', false));

		this.additionalItems = this.addProperty('additionalItems', new ModelNodeCollection(() => new AdditionalItemModel()));
		this.additionalItemsSlots = this.addProperty('additionalItemsSlots', new ModelNodeCollection(null, false));
		this.additionalItems.addOnAddListener((ai) => this.createAdditionalSlot(ai));
		this.additionalItems.addOnRemoveListener((ai) => this.removeAdditionalSlot(ai));
	}

	createAdditionalSlot(ai) {
		const item = new ItemModel();
		item.definitionId.set(ai.definitionId.get());
		const slot = new ItemSlotModel(['all'], ai.slotName.get());
		slot.item.set(item);
		this.additionalItemsSlots.add(slot);
		return slot;
	}

	removeAdditionalSlot(ai) {
		const slot = this.additionalItemsSlots.find((s) => ai.slotName.equalsTo(s.name) && ai.definitionId.equalsTo(s.item.definitionId));
		if (!slot) {
			console.warn(ai, 'slot not found, cannot remove');
			return;
		}
		this.additionalItemsSlots.remove(slot);
	}

	clone() {
		const ch = new CharacterModel();
		ch.restoreState(this.getState());
		ch.originalId.set(this.id.get());
		return ch;
	}

}
