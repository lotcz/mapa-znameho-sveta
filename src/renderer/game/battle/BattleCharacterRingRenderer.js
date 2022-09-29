import SvgRenderer from "../../basic/SvgRenderer";
import NullableNodeRenderer from "../../basic/NullableNodeRenderer";
import BattleCharacterTargetRenderer from "./BattleCharacterTargetRenderer";

export default class BattleCharacterRingRenderer extends SvgRenderer {

	/**
	 * @type BattleCharacterModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;
		this.group = null;

		this.battleMap = this.game.saveGame.get().currentBattle.get().battleMap.get();

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.targetPosition,
				(m) => new BattleCharacterTargetRenderer(this.game, m, this.draw)
			)
		);
	}

	activateInternal() {
		this.group = this.draw.group();

		const size = this.battleMap.tileSize.get();
		this.circle = this.group.ellipse(size, size / 2);
		this.circle.fill('transparent').stroke({width: 3, color: 'green'});
		this.updatePosition();
	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
	}

	renderInternal() {
		if (this.model.position.isDirty) {
			this.updatePosition();
		}
	}

	updatePosition() {
		const tileCoords = this.battleMap.positionToScreenCoords(this.model.position);
		this.group.center(tileCoords.x, tileCoords.y);
	}
}
