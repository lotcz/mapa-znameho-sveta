import ControllerNode from "../basic/ControllerNode";
import SequenceController from "./sequence/SequenceController";
import MainScreenController from "./MainScreenController";
import NullableNodeController from "../basic/NullableNodeController";
import BattleModel from "../../model/game/battle/BattleModel";
import BattleNpcCharacterModel from "../../model/game/battle/BattleNpcCharacterModel";
import BattlePartyCharacterModel from "../../model/game/battle/BattlePartyCharacterModel";
import Vector2 from "../../model/basic/Vector2";
import Pixies from "../../class/basic/Pixies";
import {SPECIAL_TYPE_SPAWN} from "../../model/game/battle/battlemap/BattleSpecialModel";

export default class SaveGameController extends ControllerNode {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;
		this.map = game.resources.map;

		this.addAutoEvent(
			this.model,
			'to-battle',
			(battleMapId) => {
				console.log('to battle', this.model.currentLocation.get());
				if (this.model.currentLocation.isSet() && !battleMapId) {
					battleMapId = this.model.currentLocation.get().battleMapId.get();
				}
				if (battleMapId) {
					this.runOnUpdate(() => this.model.currentBattleMapId.set(battleMapId));
				}
			}
		);

		this.addAutoEvent(
			this.model,
			'to-map',
			() => {
				console.log('to map');
				this.runOnUpdate(() => this.model.currentBattleMapId.set(null));
			}
		);

		this.addAutoEvent(
			this.model.currentBattleMapId,
			'change',
			() => {
				if (this.model.currentBattleMapId.isSet()) {
					this.toBattle(this.model.currentBattleMapId.get());
				} else {
					this.model.currentBattle.set(null);
				}
			},
			true
		);

		this.addAutoEvent(
			this.model.currentPathId,
			'change',
			() => {
				this.runOnUpdate(() => this.model.currentPath.set(this.map.paths.getById(this.model.currentPathId.get())));
			},
			true
		);

		this.addAutoEvent(
			this.model.currentLocationId,
			'change',
			() => {
				this.runOnUpdate(() => this.model.currentLocation.set(this.map.locations.getById(this.model.currentLocationId.get())));
			},
			true
		);

		this.addAutoEvent(
			this.model,
			'quest-completed',
			(id) => {

			}
		);

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.animationSequence,
				(m) => new SequenceController(this.game, m, this.model),
				() => new MainScreenController(this.game, this.model)
			)
		);

		this.addAutoEvent(
			this.model,
			'start-sequence',
			(sequenceId) => {
				this.runOnUpdate(() => this.startSequence(sequenceId));
			}
		);

		this.addAutoEvent(
			this.model,
			'sequence-finished',
			() => {
				this.runOnUpdate(() => this.sequenceFinished());
			}
		);
	}

	startSequence(sequenceId) {
		const sequence = this.game.resources.sequences.getById(sequenceId);
		this.model.animationSequence.set(null);
		this.model.animationSequence.set(sequence);
	}

	sequenceFinished() {
		this.model.animationSequence.set(null);
		console.log('sequence finished');
	}

	toBattle(battleMapId) {
		const map = this.game.resources.map.battleMaps.getById(battleMapId);
		if (!map) {
			console.log('no battle map found, id =', battleMapId);
			return;
		}

		let battle = this.model.battles.find((b) => b.battleMapId.equalsTo(battleMapId));

		// create battle
		if (!battle) {
			battle = new BattleModel();
			battle.battleMapId.set(battleMapId);

			// create NPCs
			map.npcSpawns.forEach(
				(spawn) => {
					const template = this.game.resources.characterTemplates.getById(spawn.characterTemplateId);
					if (!template) {
						console.log('No character template found ', spawn.characterTemplateId.get());
						return;
					}
					const character = this.model.characters.add(template.clone());
					const npc = new BattleNpcCharacterModel();
					npc.characterId.set(character.id.get());
					npc.position.set(spawn.position);
					battle.npcCharacters.add(npc);
				}
			);

			this.model.battles.add(battle);
		}

		// create party
		const spawns = map.specials.filter((s) => s.type.equalsTo(SPECIAL_TYPE_SPAWN));
		const lastPos = map.screenCoordsToPosition(map.size.multiply(0.5));
		const center = lastPos.clone();

		battle.partyCharacters.reset();

		this.model.party.slots.forEach((slot) => {
			const character = new BattlePartyCharacterModel();
			character.characterId.set(slot.characterId.get());
			if (spawns.length > 0) {
				const spawn = spawns[0];
				spawns.splice(0, 1);
				lastPos.set(spawn.position);
				character.position.set(spawn.position);
			} else {
				const position = lastPos.add(new Vector2(Pixies.random(-5, 5), Pixies.random(-5, 5))).round();
				character.position.set(position);
			}
			character.rotation.set(Math.PI);
			battle.partyCharacters.add(character);

			if (this.model.party.selectedCharacterId.equalsTo(slot.characterId)) {
				center.set(character.position);
			}
		});

		battle.coordinates.set(map.positionToScreenCoords(center));
		battle.zoom.set(1);

		this.model.currentBattle.set(battle);
	}
}
