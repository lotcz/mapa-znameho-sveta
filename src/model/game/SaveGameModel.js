import ModelNode from "../basic/ModelNode";
import Vector2 from "../basic/Vector2";
import BattleModel from "./battle/BattleModel";
import ModelNodeTable from "../basic/ModelNodeTable";
import CharacterModel from "./party/characters/CharacterModel";
import NullableNode from "../basic/NullableNode";
import PartyModel from "./party/PartyModel";
import IntValue from "../basic/IntValue";
import FloatValue from "../basic/FloatValue";
import BoolValue from "../basic/BoolValue";
import ModelNodeCollection from "../basic/ModelNodeCollection";
import CompletedQuestsModel from "./quests/CompletedQuestsModel";
import PartySlotModel from "./party/PartySlotModel";
import TimeModel from "./TimeModel";

export default class SaveGameModel extends ModelNode {

	/**
	 * @type Vector2
	 */
	mapSize;

	/**
	 * @type TimeModel
	 */
	time;

	/**
	 * @type ModelNodeTable
	 */
	characters;

	/**
	 * @type ModelNodeCollection<BattleModel>
	 */
	battles;

	/**
	 * @type PartyModel
	 */
	party;

	/**
	 * @type Vector2
	 */
	mapCenterCoordinates;

	/**
	 * @type Vector2
	 */
	mapCornerCoordinates;

	/**
	 * @type Vector2
	 */
	partyCoordinates;

	/**
	 * @type Vector2
	 */
	lastPartyCoordinates;

	/**
	 * @type FloatValue
	 */
	zoom;

	/**
	 * @type FloatValue
	 */
	pathProgress;

	/**
	 * @type BoolValue
	 */
	forward;

	/**
	 * @type BoolValue
	 */
	partyTraveling;

	/**
	 * @type FloatValue
	 */
	partyResting;

	/**
	 * @type IntValue
	 */
	lastPathId;

	/**
	 * @type IntValue
	 */
	currentPathId;

	/**
	 * @type NullableNode
	 */
	currentPath;

	/**
	 * @type IntValue
	 */
	currentLocationId;

	/**
	 * @type NullableNode<LocationModel>
	 */
	currentLocation;

	/**
	 * @type IntValue
	 */
	currentBiotopeId;

	/**
	 * @type NullableNode<BiotopeModel>
	 */
	currentBiotope;

	/**
	 * @type IntValue
	 */
	lastBattleMapId;

	/**
	 * @type IntValue
	 */
	currentBattleMapId;

	/**
	 * @type NullableNode<BattleModel>
	 */
	currentBattle;

	/**
	 * @type NullableNode
	 */
	conversation;

	/**
	 * @type NullableNode<ItemSlotModel>
	 */
	selectedInventorySlot;

	/**
	 * @type CompletedQuestsModel
	 */
	completedStages;

	/**
	 * @type NullableNode<SequenceModel>
	 */
	animationSequence;

	constructor() {
		super();

		this.mapSize = this.addProperty('mapSize', new Vector2(8192, 6144, false));
		this.time = this.addProperty('time', new TimeModel());
		this.characters = this.addProperty('characters', new ModelNodeTable((id) => new CharacterModel(id)));
		this.battles = this.addProperty('battles', new ModelNodeCollection(() => new BattleModel()));
		this.lastBattleMapId = this.addProperty('lastBattleMapId', new IntValue());
		this.currentBattleMapId = this.addProperty('currentBattleMapId', new IntValue());
		this.currentBattle = this.addProperty('currentBattle', new NullableNode(null, false));

		this.party = this.addProperty('party', new PartyModel());

		this.mapCenterCoordinates = this.addProperty('mapCenterCoordinates', new Vector2());
		this.mapCornerCoordinates = this.addProperty('mapCornerCoordinates', new Vector2());

		this.partyCoordinates = this.addProperty('partyCoordinates', new Vector2());
		this.lastPartyCoordinates = this.addProperty('lastPartyCoordinates', new Vector2());
		this.partyCoordinates.addOnChangeListener((param) => {
			this.lastPartyCoordinates.set(param.oldValue);
		});
		this.zoom = this.addProperty('startZoom', new FloatValue(1));

		this.pathProgress = this.addProperty('pathProgress', new FloatValue(0));
		this.forward = this.addProperty('forward', new BoolValue(true));
		this.partyTraveling = this.addProperty('partyTraveling', new BoolValue(false, false));
		this.partyResting = this.addProperty('partyResting', new FloatValue(0, false));

		this.lastPathId = this.addProperty('lastPathId', new IntValue());
		this.currentPathId = this.addProperty('currentPathId', new IntValue());

		this.currentPath = this.addProperty('currentPath', new NullableNode(null, false));
		this.currentPath.addOnChangeListener((param) => {
			if (param.oldValue) {
				param.oldValue.isCurrentPath.set(false);
			}
			if (param.newValue) {
				param.newValue.isCurrentPath.set(true);
				param.newValue.pathProgress.set(this.pathProgress.get());
			}
		});

		this.currentLocationId = this.addProperty('currentLocationId', new IntValue());
		this.currentLocation = this.addProperty('currentLocation', new NullableNode(null, false));

		this.currentBiotopeId = this.addProperty('currentBiotopeId', new IntValue());
		this.currentBiotope = this.addProperty('currentBiotope', new NullableNode(null, false));

		this.conversation = this.addProperty('conversation', new NullableNode());

		this.selectedInventorySlot = this.addProperty('selectedInventorySlot', new NullableNode(null, false));

		this.completedStages = this.addProperty('completedStages', new CompletedQuestsModel());

		this.animationSequence = this.addProperty('animationSequence', new NullableNode(null, false));
	}

	addCharacterToParty(character) {
		const chr = character.clone();
		this.characters.add(chr);
		const slot = this.party.slots.add(new PartySlotModel());
		slot.characterId.set(chr.id.get());
		this.party.selectedCharacterId.set(chr.id.get());
	}
}
