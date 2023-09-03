import SvgRendererWithBattle from "../../basic/SvgRendererWithBattle";
import BattleRingRenderer, {BattleRingStyle} from "./BattleRingRenderer";
import ConditionalNodeRenderer from "../../basic/ConditionalNodeRenderer";

export default class BattleCharacterHoverRenderer extends SvgRendererWithBattle {

	/**
	 * @type BattleCharacterModel|BattleNpcCharacterModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.battle.partyCharacters.selectedNode,
				() => !this.battle.partyCharacters.selectedNode.equalsTo(this.model),
				() => new BattleRingRenderer(this.game, this.model.position, this.draw, this.getRingStyle())
			)
		);
	}

	getRingStyle() {
		/**
		 * @type CharacterModel
		 */
		const character = this.model.character.get();
		return new BattleRingStyle(
			character.stats.isAggressive.get() ? 'rgb(155, 0, 0)' : 'rgb(50, 105, 10)'
		);
	}


}
