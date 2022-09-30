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
		const width = size / 25;
		this.circle = this.group.ellipse(size - (2 * width), (size / 2) - (2 * width));
		this.radial = this.draw.gradient(
			'radial',
			function(add) {
				add.stop(0, 'rgba(0, 255, 0, 0)');
				add.stop(0.5, 'rgba(0, 255, 0, 0)');
				add.stop(1, 'green');
			}
		);
		this.circle.fill(this.radial).stroke({width: width, color: 'green'});
		this.updatePosition();
	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
		this.radial.remove();
		this.radial = null;
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
