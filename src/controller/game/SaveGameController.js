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
import ItemSlotsController from "./items/ItemSlotsController";
import QuestOverlayModel from "../../model/game/quests/QuestOverlayModel";
import AnimationFloatController from "../basic/AnimationFloatController";
import {EASING_FLAT, EASING_QUAD_IN} from "../../class/animating/ProgressValue";
import TimeoutController from "../basic/TimeoutController";

export default class SaveGameController extends ControllerNode {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;
		this.map = game.resources.map;

		this.addChild(
			new ItemSlotsController(
				this.game,
				this.model
			)
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
			'to-battle',
			(battleMapId) => {
				if (this.model.currentLocation.isSet() && !battleMapId) {
					battleMapId = this.model.currentLocation.get().battleMapId.get();
				}
				if (battleMapId) {
					this.runOnUpdate(() => {
						const battle = this.model.currentBattle.get();
						if (battle) {
							battle.partyCharacters.reset();
						}
						this.model.currentBattleMapId.set(battleMapId);
					});
				}
			}
		);

		this.addAutoEvent(
			this.model,
			'to-map',
			() => {
				const battle = this.model.currentBattle.get();
				if (battle) {
					battle.partyCharacters.reset();
				}
				this.runOnUpdate(() => this.model.currentBattleMapId.set(null));
			}
		);

		this.addAutoEvent(
			this.model.currentBattleMapId,
			'change',
			(param) => {
				if (param) {
					this.model.lastBattleMapId.set(param.oldValue);
				}
				if (this.model.currentBattleMapId.isSet()) {
					const battle = this.obtainBattle(this.model.currentBattleMapId.get());
					this.model.currentBattle.set(battle);
				} else {
					this.model.currentBattle.set(null);
				}
			},
			true
		);

		this.addAutoEvent(
			this.model.currentPathId,
			'change',
			(param) => {
				this.runOnUpdate(() => {
					if (param) {
						this.model.lastPathId.set(param.oldValue);
					}
					this.model.currentPath.set(this.map.paths.getById(this.model.currentPathId.get()));
				});
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

		this.addAutoEvent(
			this.model,
			'character-joins-party',
			(character) => {
				this.model.addCharacterToParty(character);
			}
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

		this.addAutoEvent(
			this.model.completedQuests,
			'quest-completed',
			(id) => {
				const quest = this.game.resources.quests.getById(id);
				if (quest) this.questCompleted(quest);
			}
		);

		this.addAutoEvent(
			this.model,
			'item-slot-hover',
			(slot) => {
				this.runOnUpdate(() => {
					const item = slot && slot.item.isSet() ? slot.item.get() : null;
					this.model.hoveringItem.set(item);
				});
			}
		);

		this.addAutoEvent(
			this.model,
			'character-hover',
			(chr) => {
				this.runOnUpdate(() => {
					this.model.hoveringCharacter.set(chr);
				});
			}
		);

		this.addAutoEvent(
			this.model,
			'stat-hover',
			(st) => {
				this.runOnUpdate(() => {
					this.model.hoveringStat.set(st);
				});
			}
		);

		this.addAutoEvent(
			this.model,
			'race-hover',
			(r) => {
				this.runOnUpdate(() => {
					this.model.hoveringRace.set(r);
				});
			}
		);

		this.addAutoEvent(
			this.model,
			'conversation-hover',
			(c) => {
				this.runOnUpdate(() => {
					this.model.hoveringConversation.set(c);
				});
			}
		);

		this.addAutoEvent(
			this.model,
			'exit-hover',
			(s) => {
				this.runOnUpdate(() => {
					this.model.hoveringExit.set(s);
				});
			}
		);
	}

	update(delta) {
		if (this.game.menu.isSet() || this.model.conversation.isSet()) return;
		super.update(delta);
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

	obtainBattle(battleMapId) {
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
					npc.homePosition.set(npc.position);
					npc.rotation.set(Math.PI);
					battle.npcCharacters.add(npc);
				}
			);

			this.model.battles.add(battle);
		}

		// create party
		if (battle.partyCharacters.isEmpty()) {
			const spawns = map.specials.filter((s) => s.type.equalsTo(SPECIAL_TYPE_SPAWN));
			let spawn = null;

			if (this.model.lastBattleMapId.isSet()) {
				spawn = spawns.find((s) => s.data.equalsTo(`battle:${this.model.lastBattleMapId.get()}`));
			}
			if (this.model.lastPathId.isSet() && !spawn) {
				spawn = spawns.find((s) => s.data.equalsTo(`path:${this.model.lastPathId.get()}`));
			}

			const spawnPosition = spawn ? spawn.position : (spawns.length > 0 ? spawns[0].position : map.screenCoordsToPosition(map.size.multiply(0.5)));

			const mapBlocks = map.getBlocks();
			const npcCharactersBlocks = battle.npcCharacters.map((ch) => ch.position.round());
			const blocks = mapBlocks.concat(npcCharactersBlocks);

			this.model.party.slots.forEach((slot) => {
				const character = new BattlePartyCharacterModel();
				character.characterId.set(slot.characterId.get());
				let position = spawnPosition;
				while (blocks.some((b) => b.equalsTo(position))) {
					position = spawnPosition.add(new Vector2(Pixies.random(-5, 5), Pixies.random(-5, 5))).round();
				}
				character.position.set(position);
				blocks.push(position);
				character.rotation.set(Math.PI);
				battle.partyCharacters.add(character);

				if (this.model.party.selectedCharacterId.equalsTo(slot.characterId)) {
					battle.coordinates.set(map.positionToScreenCoords(character.position));
				}
			});
		}

		return battle;
	}

	questCompleted(quest) {
		const overlay = new QuestOverlayModel(quest);
		this.model.completedQuestOverlay.set(overlay);
		this.addChild(
			new AnimationFloatController(
				this.game,
				overlay.opacity,
				1,
				3000,
				EASING_FLAT
			).onFinished(() => {
				this.addChild(
					new TimeoutController(
						this.game,
						3000,
						() => {
							this.addChild(
								new AnimationFloatController(
									this.game,
									overlay.opacity,
									0,
									3000,
									EASING_QUAD_IN
								).onFinished(() => {
									this.model.completedQuestOverlay.set(null);
								})
							);
						}
					)
				);
			})
		);
	}
}
