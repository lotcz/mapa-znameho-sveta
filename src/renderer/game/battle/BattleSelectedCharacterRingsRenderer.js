import SvgRendererWithBattle from "../../basic/SvgRendererWithBattle";
import BattleRingRenderer, {BattleRingStyle} from "./BattleRingRenderer";
import NullableNodeRenderer from "../../basic/NullableNodeRenderer";

export default class BattleSelectedCharacterRingsRenderer extends SvgRendererWithBattle {

	/**
	 * @type BattleCharacterModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;

		this.addChild(
			new BattleRingRenderer(
				this.game,
				this.model.position,
				this.draw,
				this.getRingStyle()
			)
		);

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.targetPosition,
				(m) =>	new BattleRingRenderer(this.game,m,	this.draw, this.getTargetRingStyle())
			)
		);
	}

	getRingStyle() {
		return new BattleRingStyle(
			'rgba(255, 255, 255, 1)',
			'rgba(255, 255, 255, 0)',
			'rgba(0, 0, 0, 0)'
		);
	}

	getTargetRingStyle() {
		return new BattleRingStyle(
			'rgb(255, 255, 0)'
		);
	}

}
